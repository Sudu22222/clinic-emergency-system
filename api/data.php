<?php
require_once 'config.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Sign in to access records."]);
    exit();
}
$userStmt = $pdo->prepare("SELECT id, user_code, role FROM users WHERE id = ?");
$userStmt->execute([$_SESSION['user_id']]);
$currentAccount = $userStmt->fetch();
if (!$currentAccount) {
    session_destroy();
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Session is no longer valid."]);
    exit();
}
$isDoctor = $currentAccount['role'] === 'doctor';
$userCode = $pdo->quote($currentAccount['user_code']);
$userId = (int)$currentAccount['id'];

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $_GET['action'] ?? ($input['action'] ?? 'list');
$type = $_GET['type'] ?? ($input['recordType'] ?? ($input['type'] ?? ''));
$id = (string)($input['id'] ?? '');
$makeId = static fn(string $prefix): string => $prefix . '-' . strtoupper(bin2hex(random_bytes(5)));
$json = static function (array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
};

if ($action === 'list') {
    $patientScope = $isDoctor ? '' : " WHERE id = $userCode";
    $appointmentScope = $isDoctor ? '' : " WHERE patient_id = $userCode";
    $requestScope = $isDoctor ? '' : " WHERE created_by_user_id = $userId";
    $patients = $pdo->query("SELECT id, name, age, gender, phone, blood_group AS bloodGroup, location,
        emergency_contact AS emergencyContact, medical_notes AS medicalNotes, registered_date AS registeredDate
        FROM patients $patientScope ORDER BY created_at DESC")->fetchAll();
    $appointments = $pdo->query("SELECT id, patient_id AS patientId, patient_name AS patientName, patient_phone AS patientPhone,
        patient_blood_group AS patientBloodGroup, doctor_id AS doctorId, doctor_name AS doctorName,
        doctor_specialty AS doctorSpecialty, date, time_slot AS timeSlot, visit_reason AS visitReason,
        priority, status, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS createdAt FROM appointments $appointmentScope ORDER BY created_at DESC")->fetchAll();
    $dispatches = $pdo->query("SELECT id, dispatch_code AS dispatchCode, patient_name AS patientName, phone,
        pickup_address AS pickupAddress, urgency, status, assigned_unit AS assignedUnit, driver_name AS driverName,
        driver_phone AS driverPhone, eta, coord_x, coord_y, destination, notes,
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS timestamp FROM ambulance_dispatches $requestScope ORDER BY timestamp DESC")->fetchAll();
    foreach ($dispatches as &$dispatch) {
        $dispatch['coordinates'] = ['x' => (int)$dispatch['coord_x'], 'y' => (int)$dispatch['coord_y']];
        unset($dispatch['coord_x'], $dispatch['coord_y']);
    }
    unset($dispatch);
    $requirements = $pdo->query("SELECT id, patient_name AS patientName, blood_group AS bloodGroup, units_needed AS unitsNeeded,
        hospital_location AS hospitalLocation, urgency, contact_person AS contactPerson, contact_phone AS contactPhone,
        posted_at AS postedAt, status, notes FROM blood_requirements $requestScope ORDER BY id DESC")->fetchAll();
    $banks = $pdo->query("SELECT id, name, location, city, address, distance, phone, available_units_json, is_verified AS isVerified,
        operating_hours AS operatingHours FROM blood_banks ORDER BY name")->fetchAll();
    foreach ($banks as &$bank) {
        $bank['availableUnits'] = json_decode($bank['available_units_json'] ?: '{}', true) ?: [];
        $bank['isVerified'] = (bool)$bank['isVerified'];
        unset($bank['available_units_json']);
    }
    unset($bank);
    $directory = $pdo->query("SELECT d.id, d.owner_user_id AS ownerUserId, COALESCE(d.doctor_name, u.name, '') AS doctorName,
        d.name, d.type, d.address, d.area, d.phone, d.emergency_helpline AS emergencyHelpline,
        d.status, d.available_rooms AS availableRooms, d.total_rooms AS totalRooms,
        d.available_beds AS availableBeds, d.total_beds AS totalBeds, d.distance, d.rating, d.services_json
        FROM healthcare_directory d LEFT JOIN users u ON u.id = d.owner_user_id ORDER BY d.name")->fetchAll();
    foreach ($directory as &$item) {
        $item['ownerUserId'] = $item['ownerUserId'] === null ? null : (string)$item['ownerUserId'];
        $item['availableRooms'] = (int)$item['availableRooms'];
        $item['totalRooms'] = (int)$item['totalRooms'];
        $item['availableBeds'] = (int)$item['availableBeds'];
        $item['totalBeds'] = (int)$item['totalBeds'];
        $item['rating'] = (float)$item['rating'];
        $item['services'] = json_decode($item['services_json'] ?: '[]', true) ?: [];
        unset($item['services_json']);
    }
    unset($item);
    $doctors = $pdo->query("SELECT user_code AS id, name, specialty, specialty AS department FROM users WHERE role = 'doctor' ORDER BY name")->fetchAll();
    foreach ($doctors as &$doctor) {
        $doctor['availableDays'] = [];
    }
    unset($doctor);
    $json(["status" => "success", "data" => compact('patients', 'appointments', 'dispatches', 'banks', 'requirements', 'directory', 'doctors')]);
    exit();
}

if ($action === 'create') {
    try {
        if ($type === 'patient') {
            if (!$isDoctor) {
                $json(["status" => "error", "message" => "Only doctor accounts can add patient records."], 403);
                exit();
            }
            $id = $makeId('PAT');
            $stmt = $pdo->prepare("INSERT INTO patients (id, name, age, gender, phone, blood_group, location, emergency_contact, medical_notes, registered_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)");
            $stmt->execute([$id, $input['name'], $input['age'], $input['gender'], $input['phone'], $input['bloodGroup'], $input['location'], $input['emergencyContact'] ?? '', $input['medicalNotes'] ?? '', $userId]);
        } elseif ($type === 'appointment') {
            if (!$isDoctor && ($input['patientId'] ?? '') !== $currentAccount['user_code']) {
                $json(["status" => "error", "message" => "You can only book an appointment for your own account."], 403);
                exit();
            }
            if (!$isDoctor) {
                $profileStmt = $pdo->prepare("SELECT name, phone, blood_group FROM users WHERE id = ?");
                $profileStmt->execute([$userId]);
                $profile = $profileStmt->fetch();
                $input['patientId'] = $currentAccount['user_code'];
                $input['patientName'] = $profile['name'];
                $input['patientPhone'] = $profile['phone'] ?? '';
                $input['patientBloodGroup'] = $profile['blood_group'] ?? '';
            }
            $id = $makeId('APT');
            $stmt = $pdo->prepare("INSERT INTO appointments (id, patient_id, patient_name, patient_phone, patient_blood_group, doctor_id, doctor_name, doctor_specialty, date, time_slot, visit_reason, priority, status, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming', ?)");
            $stmt->execute([$id, $input['patientId'] ?? '', $input['patientName'], $input['patientPhone'], $input['patientBloodGroup'], $input['doctorId'], $input['doctorName'], $input['doctorSpecialty'], $input['date'], $input['timeSlot'], $input['visitReason'], $input['priority'], $userId]);
        } elseif ($type === 'dispatch') {
            if (!$isDoctor) {
                $profileStmt = $pdo->prepare("SELECT name, phone FROM users WHERE id = ?");
                $profileStmt->execute([$userId]);
                $profile = $profileStmt->fetch();
                $input['patientName'] = $profile['name'];
                $input['phone'] = $profile['phone'] ?? '';
            }
            $id = $makeId('DISP');
            $code = $makeId('AMB');
            $stmt = $pdo->prepare("INSERT INTO ambulance_dispatches (id, dispatch_code, patient_name, phone, pickup_address, urgency, status, assigned_unit, driver_name, driver_phone, eta, destination, notes, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, 'Pending', '', '', '', '', '', ?, ?)");
            $stmt->execute([$id, $code, $input['patientName'], $input['phone'], $input['pickupAddress'], $input['urgency'], $input['notes'] ?? '', $userId]);
        } elseif ($type === 'requirement') {
            $id = $makeId('REQ');
            $stmt = $pdo->prepare("INSERT INTO blood_requirements (id, patient_name, blood_group, units_needed, hospital_location, urgency, contact_person, contact_phone, posted_at, status, notes, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'Open', ?, ?)");
            $stmt->execute([$id, $input['patientName'], $input['bloodGroup'], $input['unitsNeeded'], $input['hospitalLocation'], $input['urgency'], $input['contactPerson'], $input['contactPhone'], $input['notes'] ?? '', $userId]);
        } elseif ($type === 'directory') {
            if (!$isDoctor) {
                $json(["status" => "error", "message" => "Only doctor accounts can add clinics to the directory."], 403);
                exit();
            }
            $availableRooms = filter_var($input['availableRooms'] ?? null, FILTER_VALIDATE_INT);
            $totalRooms = filter_var($input['totalRooms'] ?? null, FILTER_VALIDATE_INT);
            $availableBeds = filter_var($input['availableBeds'] ?? null, FILTER_VALIDATE_INT);
            $totalBeds = filter_var($input['totalBeds'] ?? null, FILTER_VALIDATE_INT);
            $validTypes = ['Small Clinic', 'Emergency Ward', 'General Hospital', 'Specialty Center'];
            $validStatuses = ['Open 24/7', 'Open', 'Busy / High Volume', 'Closed'];
            if (empty($input['name']) || empty($input['address']) || empty($input['area']) || empty($input['phone']) ||
                !in_array($input['type'] ?? '', $validTypes, true) || !in_array($input['status'] ?? '', $validStatuses, true) ||
                $availableRooms === false || $totalRooms === false || $availableBeds === false || $totalBeds === false ||
                min($availableRooms, $totalRooms, $availableBeds, $totalBeds) < 0 || $availableRooms > $totalRooms || $availableBeds > $totalBeds) {
                $json(["status" => "error", "message" => "Enter the required clinic details and valid room/bed counts. Available counts cannot exceed totals."], 400);
                exit();
            }
            $id = $makeId('CLINIC');
            $services = array_values(array_filter(array_map('trim', $input['services'] ?? [])));
            $doctorStmt = $pdo->prepare("SELECT name FROM users WHERE id = ?");
            $doctorStmt->execute([$userId]);
            $doctorName = $doctorStmt->fetchColumn();
            $stmt = $pdo->prepare("INSERT INTO healthcare_directory (id, owner_user_id, doctor_name, name, type, address, area, phone, emergency_helpline, status, available_rooms, total_rooms, available_beds, total_beds, distance, services_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)");
            $stmt->execute([$id, $userId, $doctorName, trim($input['name']), $input['type'], trim($input['address']), trim($input['area']), trim($input['phone']), trim($input['emergencyHelpline'] ?? ''), $input['status'], $availableRooms, $totalRooms, $availableBeds, $totalBeds, json_encode($services)]);
        } else {
            $json(["status" => "error", "message" => "Unknown record type."], 400);
            exit();
        }
        $json(["status" => "success", "id" => $id]);
    } catch (Throwable $e) {
        error_log('HealthPulse record create failed: ' . $e->getMessage());
        $json(["status" => "error", "message" => "Could not save this record. Check required fields and database setup."], 400);
    }
    exit();
}

if ($action === 'update') {
    if ($type === 'directory') {
        if (!$isDoctor) {
            $json(["status" => "error", "message" => "Only doctor accounts can edit clinic listings."], 403);
            exit();
        }
        $availableRooms = filter_var($input['availableRooms'] ?? null, FILTER_VALIDATE_INT);
        $totalRooms = filter_var($input['totalRooms'] ?? null, FILTER_VALIDATE_INT);
        $availableBeds = filter_var($input['availableBeds'] ?? null, FILTER_VALIDATE_INT);
        $totalBeds = filter_var($input['totalBeds'] ?? null, FILTER_VALIDATE_INT);
        $validTypes = ['Small Clinic', 'Emergency Ward', 'General Hospital', 'Specialty Center'];
        $validStatuses = ['Open 24/7', 'Open', 'Busy / High Volume', 'Closed'];
        if (empty($input['name']) || empty($input['address']) || empty($input['area']) || empty($input['phone']) ||
            !in_array($input['type'] ?? '', $validTypes, true) || !in_array($input['status'] ?? '', $validStatuses, true) ||
            $availableRooms === false || $totalRooms === false || $availableBeds === false || $totalBeds === false ||
            min($availableRooms, $totalRooms, $availableBeds, $totalBeds) < 0 || $availableRooms > $totalRooms || $availableBeds > $totalBeds) {
            $json(["status" => "error", "message" => "Enter the required clinic details and valid room/bed counts. Available counts cannot exceed totals."], 400);
            exit();
        }
        $services = array_values(array_filter(array_map('trim', $input['services'] ?? [])));
        $stmt = $pdo->prepare("UPDATE healthcare_directory SET name = ?, type = ?, address = ?, area = ?, phone = ?, emergency_helpline = ?, status = ?, available_rooms = ?, total_rooms = ?, available_beds = ?, total_beds = ?, services_json = ? WHERE id = ? AND owner_user_id = ?");
        $stmt->execute([trim($input['name']), $input['type'], trim($input['address']), trim($input['area']), trim($input['phone']), trim($input['emergencyHelpline'] ?? ''), $input['status'], $availableRooms, $totalRooms, $availableBeds, $totalBeds, json_encode($services), $id, $userId]);
        if ($stmt->rowCount() === 0) {
            $check = $pdo->prepare("SELECT 1 FROM healthcare_directory WHERE id = ? AND owner_user_id = ?");
            $check->execute([$id, $userId]);
            if (!$check->fetchColumn()) {
                $json(["status" => "error", "message" => "Clinic not found or you do not own this listing."], 404);
                exit();
            }
        }
        $json(["status" => "success"]);
        exit();
    }
    $allowed = [
        'appointment' => ['appointments', 'status'],
        'dispatch' => ['ambulance_dispatches', 'status'],
        'requirement' => ['blood_requirements', 'status'],
    ];
    if (!isset($allowed[$type]) || $id === '') {
        $json(["status" => "error", "message" => "Invalid record update."], 400);
        exit();
    }
    [$table, $field] = $allowed[$type];
    if (!$isDoctor) {
        if ($type !== 'appointment' || ($input['status'] ?? '') !== 'Cancelled') {
            $json(["status" => "error", "message" => "Only doctor accounts can update this record."], 403);
            exit();
        }
        $stmt = $pdo->prepare("UPDATE appointments SET status = 'Cancelled' WHERE id = ? AND patient_id = ?");
        $stmt->execute([$id, $currentAccount['user_code']]);
    } else {
        $stmt = $pdo->prepare("UPDATE `$table` SET `$field` = ? WHERE id = ?");
        $stmt->execute([$input['status'] ?? '', $id]);
    }
    $json(["status" => "success"]);
    exit();
}

$json(["status" => "error", "message" => "Invalid data action."], 400);