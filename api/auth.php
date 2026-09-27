<?php
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? ($input['action'] ?? 'login');

$formatUser = static function (array $row): array {
    return [
        "id" => (string)$row['id'],
        "userCode" => $row['user_code'],
        "name" => $row['name'],
        "email" => $row['email'],
        "role" => $row['role'],
        "phone" => $row['phone'],
        "bloodGroup" => $row['blood_group'],
        "location" => $row['location'],
        "specialty" => $row['specialty'],
        "patientId" => $row['role'] === 'patient' ? $row['user_code'] : null
    ];
};

if ($action === 'me') {
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Not signed in."]);
        exit();
    }
    $stmt = $pdo->prepare("SELECT id, user_code, name, email, role, phone, blood_group, location, specialty FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $row = $stmt->fetch();
    if (!$row) {
        session_destroy();
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Session is no longer valid."]);
        exit();
    }
    echo json_encode(["status" => "success", "user" => $formatUser($row)]);
    exit();
}

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    echo json_encode(["status" => "success", "message" => "Signed out."]);
    exit();
}

if ($action === 'register') {
    $name = trim($input['name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';
    $role = $input['role'] ?? 'patient';
    $phone = trim($input['phone'] ?? '');
    $bloodGroup = trim($input['bloodGroup'] ?? '');
    $location = trim($input['location'] ?? '');
    $specialty = trim($input['specialty'] ?? '');
    $registrationCode = $input['registrationCode'] ?? '';

    if (!in_array($role, ['patient', 'doctor'], true)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid account type."]);
        exit();
    }

    if (empty($name) || empty($email) || empty($phone) || strlen($password) < 8 || ($role === 'patient' && empty($bloodGroup))) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name, email, phone, and a password of at least 8 characters are required. Patients must also select a blood group."]);
        exit();
    }

    if ($role === 'doctor' && (empty($specialty) || empty($doctorRegistrationCode) || !hash_equals($doctorRegistrationCode, $registrationCode))) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => empty($doctorRegistrationCode)
            ? "Doctor registration is not enabled. Ask the system owner to configure the server invitation code."
            : "The doctor registration code is invalid."]);
        exit();
    }

    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "An account with this email already exists."]);
        exit();
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $userCode = ($role === 'doctor' ? 'DOC-' : 'PAT-') . strtoupper(bin2hex(random_bytes(4)));

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO users (user_code, name, email, password_hash, role, phone, blood_group, location, specialty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userCode, $name, $email, $passwordHash, $role, $phone, $bloodGroup, $location, $specialty]);
        $userId = (int)$pdo->lastInsertId();
        if ($role === 'patient') {
            $profile = $pdo->prepare("INSERT INTO patients (id, name, age, gender, phone, blood_group, location, emergency_contact, medical_notes, registered_date, user_id) VALUES (?, ?, NULL, NULL, ?, ?, ?, '', '', CURDATE(), ?)");
            $profile->execute([$userCode, $name, $phone, $bloodGroup, $location, $userId]);
        }
        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
    $user = ["id" => (string)$userId, "userCode" => $userCode, "name" => $name, "email" => $email,
        "role" => $role, "phone" => $phone, "bloodGroup" => $bloodGroup ?: null, "location" => $location,
        "specialty" => $role === 'doctor' ? $specialty : null, "patientId" => $role === 'patient' ? $userCode : null];

    echo json_encode(["status" => "success", "message" => "Account created successfully!", "user" => $user]);
    exit();
}

if ($action === 'login') {
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Email and password are required."]);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $userRow = $stmt->fetch();

    if (!$userRow || !password_verify($password, $userRow['password_hash'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
        exit();
    }

    $expectedRole = $input['expectedRole'] ?? 'patient';
    if (!in_array($expectedRole, ['patient', 'doctor'], true) || $userRow['role'] !== $expectedRole) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => $userRow['role'] === 'doctor'
            ? "This is a doctor/admin account. Choose Doctor / Admin login."
            : "This is a patient account. Choose Patient Login."]);
        exit();
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$userRow['id'];
    $user = $formatUser($userRow);

    echo json_encode(["status" => "success", "message" => "Login successful!", "user" => $user]);
    exit();
}

http_response_code(400);
echo json_encode(["status" => "error", "message" => "Invalid auth action."]);
