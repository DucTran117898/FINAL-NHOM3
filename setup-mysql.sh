#!/bin/bash

echo "========================================="
echo "MySQL & PHP Setup Script for Codespace"
echo "========================================="
echo ""

# Update package list
echo "📦 Updating package list..."
sudo apt-get update -qq

# Install MySQL client and server
echo "📥 Installing MySQL client and server..."
sudo apt-get install -y mysql-client mysql-server > /dev/null 2>&1

# Start MySQL service
echo "🚀 Starting MySQL service..."
sudo service mysql start

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 3

# Fix MySQL socket permissions
echo "🔧 Fixing MySQL socket permissions..."
sudo chmod 777 /var/run/mysqld/mysqld.sock
sudo usermod -a -G mysql codespace

# Create database
echo "🗄️  Creating database..."
sudo mysql -h 127.0.0.1 -u root -e "CREATE DATABASE IF NOT EXISTS school_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import schema
echo "📋 Importing database schema..."
sudo mysql -h 127.0.0.1 -u root school_management < /workspaces/FINAL-NHOM3/final-api/database_schema.sql

# Configure MySQL user for TCP access without password
echo "👤 Configuring MySQL user..."
sudo mysql -h 127.0.0.1 -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
sudo mysql -h 127.0.0.1 -u root -e "GRANT ALL PRIVILEGES ON school_management.* TO 'root'@'localhost';"
sudo mysql -h 127.0.0.1 -u root -e "FLUSH PRIVILEGES;"

# Update .env file to use 127.0.0.1
echo "⚙️  Updating .env configuration..."
if [ -f /workspaces/FINAL-NHOM3/final-api/.env ]; then
    sed -i 's/DB_HOST=localhost/DB_HOST=127.0.0.1/g' /workspaces/FINAL-NHOM3/final-api/.env
fi

# Install PHP PDO MySQL Extension
echo "🔌 Installing PHP PDO MySQL extension..."
if ! php -m | grep -q "pdo_mysql"; then
    echo "   Compiling pdo_mysql extension..."
    cd /tmp
    rm -rf php-8.0.30*
    
    # Download and extract PHP source
    wget -q http://museum.php.net/php8/php-8.0.30.tar.gz
    tar xzf php-8.0.30.tar.gz
    
    # Compile pdo_mysql extension
    cd php-8.0.30/ext/pdo_mysql
    phpize > /dev/null 2>&1
    ./configure --with-pdo-mysql=mysqlnd > /dev/null 2>&1
    make > /dev/null 2>&1
    sudo make install > /dev/null 2>&1
    
    # Enable extension
    echo "extension=pdo_mysql.so" | sudo tee /opt/php/8.0.30/ini/conf.d/99-pdo_mysql.ini > /dev/null
    
    # Cleanup
    cd /tmp
    rm -rf php-8.0.30*
    
    echo "   ✅ pdo_mysql extension installed successfully!"
else
    echo "   ✅ pdo_mysql extension already installed"
fi

# Verify installation
echo ""
echo "✅ Verifying installation..."
mysql -h 127.0.0.1 -u root -e "USE school_management; SHOW TABLES;"
echo ""
echo "PHP Extensions:"
php -m | grep -i pdo

echo ""
echo "========================================="
echo "✨ Setup completed successfully!"
echo "========================================="
echo ""
echo "📌 Database Information:"
echo "   Host: 127.0.0.1"
echo "   Database: school_management"
echo "   User: root"
echo "   Password: (empty)"
echo ""
echo "🚀 To connect to MySQL:"
echo "   mysql -h 127.0.0.1 -u root school_management"
echo ""
echo "🖥️  To start servers:"
echo "   Backend:  cd /workspaces/FINAL-NHOM3/final-api && php -S 0.0.0.0:8000 index.php"
echo "   Frontend: cd /workspaces/FINAL-NHOM3/final-frontend && npm run dev"
echo ""
