# FINAL-NHOM3 - School Management System

## Codespaces Setup Instructions

### First Time Setup (or Every Time You Start Codespaces)

1. **Run the setup script:**
   ```bash
   bash setup-mysql.sh
   ```

   This script will:
   - Install and configure MySQL
   - Create the `school_management` database
   - Import the database schema
   - Compile and install PHP PDO MySQL extension
   - Fix permissions for MySQL socket
   - Update .env configuration

2. **Start the backend server:**
   ```bash
   cd final-api
   php -S 0.0.0.0:8000 index.php
   ```

3. **Start the frontend server (in a new terminal):**
   ```bash
   cd final-frontend
   npm run dev
   ```

### Login Credentials

- **Admin:**
  - Login ID: `admin`
  - Password: `123456`

- **Teachers:**
  - Login ID: `teacher1` or `teacher2`
  - Password: `123456`

- **Students:**
  - Login ID: `student1` or `student2`
  - Password: `123456`

### Database Information

- Host: `127.0.0.1`
- Database: `school_management`
- User: `root`
- Password: (empty)

### Troubleshooting

If you encounter any database connection errors:

1. Make sure MySQL is running:
   ```bash
   sudo service mysql status
   ```

2. If not running, start it:
   ```bash
   sudo service mysql start
   ```

3. Test database connection:
   ```bash
   mysql -h 127.0.0.1 -u root school_management
   ```

4. Verify PHP has pdo_mysql extension:
   ```bash
   php -m | grep pdo_mysql
   ```

### Notes for Codespaces

- The setup script must be run every time you restart your Codespace
- All installations (MySQL, PHP extensions) are ephemeral and will be lost on restart
- Your code and database schema are preserved in the repository
- The script takes ~2-3 minutes to complete on first run
