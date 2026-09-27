# HealthPulse

HealthPulse is a React frontend with a PHP/MySQL API. Authentication uses PHP sessions; patient accounts, appointments, ambulance requests, blood requests, directory records, and blood-bank records are loaded from MySQL. The app starts at sign-in and contains no preloaded demo accounts or sample records.

## Local setup with XAMPP

1. Start Apache and MySQL in the XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`, create/import the database by importing [`api/database.sql`](api/database.sql). It creates `healthpulse_db` and all required tables.
3. Put the project (or its built files and `api` folder) under XAMPP's `htdocs`. For example, use `C:\xampp\htdocs\healthpulse`.
4. Check the database values in [`api/config.php`](api/config.php). The defaults are `localhost`, MySQL user `root`, an empty password, and database `healthpulse_db`, which match a typical fresh XAMPP install. Change these for your MySQL setup.
5. Install Node.js dependencies and build the frontend:

   ```sh
   npm install
   npm run build
   ```

6. Copy the contents of `dist` into the web directory (`htdocs/healthpulse` in the example), and copy the PHP files from `api` into its `api` subdirectory. Do not put the SQL setup files in the public web directory.
7. Open the app through Apache, for example `http://localhost/healthpulse/`. The frontend and PHP API should use the same host and scheme so PHP session cookies work.

For development in this workspace, keep XAMPP MySQL running, then start the PHP API server from the project folder in a separate PowerShell terminal:

```powershell
$env:DOCTOR_REGISTRATION_CODE = 'replace-with-a-private-long-random-code'
& 'C:\xampp\php\php.exe' -S 127.0.0.1:8000 -t .
```

Run `npm run dev` in another terminal. Vite forwards `/api` requests to that PHP server, so PHP runs the endpoints instead of returning their source as static text. If PHP listens on another address or port, set `VITE_PHP_API_TARGET` in an untracked `.env.local` file, for example `VITE_PHP_API_TARGET=http://127.0.0.1:8001`, and restart Vite. For the deployed app, configure `DOCTOR_REGISTRATION_CODE` as a private server environment variable, then serve the frontend and `api` folder through Apache as described below; Vite's proxy is development-only. Never put the registration code in frontend code or commit it to the repository.

## Existing database

If you imported an earlier version of `database.sql`, import [`api/database-migration.sql`](api/database-migration.sql) once in phpMyAdmin before deploying the updated PHP API. Do not run that migration more than once. A new installation should use `database.sql` only.

The full `database-migration.sql` also adds the clinic-directory columns. If that full migration has already been run, do not run the directory-only migration as well. Use [`api/database-directory-migration.sql`](api/database-directory-migration.sql) once only when the other migration has not added those columns. New installations already get these columns from `database.sql`.

## Clinic directory listings

Sign in as a doctor and open **Doctors & Medical Center Directory**. Choose **Add my clinic** to create a facility listing with its address, contact details, services, operating status, total/available rooms, and total/available beds. A doctor can edit only listings they created. Patient accounts can view directory details but cannot add or edit listings; these permissions are also checked by the PHP API.

## First staff account

Doctor/Admin login has a **New doctor? Create a doctor account** link. It creates a doctor account with a specialty after the configured private `DOCTOR_REGISTRATION_CODE` is entered. Share that code only with approved staff. Patient sign-up remains separate and cannot create staff accounts.

For the first staff account, or if you prefer manual provisioning, create an account through patient sign-up and promote it in phpMyAdmin's SQL tab. Replace the email and specialty with real values:

```sql
UPDATE users
SET role = 'doctor', specialty = 'Healthcare Administration', user_code = CONCAT('DOC-', id)
WHERE email = 'your-staff-email@example.com';
```

Sign out and sign in again for the new role to take effect. Create additional doctor accounts through sign-up and promote each trusted account the same way. Use a unique, strong password for every account.

## Live hosting

The host must support PHP sessions, PDO MySQL, and a MySQL database; a static-only host cannot run this API. Create a database and database user in the hosting panel, import `database.sql` using the host's phpMyAdmin, then configure the host-specific DB host/name/user/password in `api/config.php` or its supported environment variables (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`). Build with `npm run build`, upload the `dist` contents to the web root, and upload `auth.php`, `config.php`, and `data.php` into the web root's `api` folder. Do not upload SQL files or a development `.env.local` into a public folder. Enable HTTPS before accepting real accounts.

## Important limitations

Blood-bank and healthcare-directory tables start empty and must be populated with verified local information in phpMyAdmin. Doctor accounts must be provisioned by a trusted administrator. Ambulance requests are stored and shown in this app; they are not sent to emergency services. This starter application is not a certified clinical system and should not be used for real patient care without a security, privacy, and operational review.

## Commands

```sh
npm run dev
npm run build
npm run lint
```