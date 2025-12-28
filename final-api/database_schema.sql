-- Database schema for MySQL

-- Table: admins
CREATE TABLE admins (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(20) UNIQUE,
    password VARCHAR(64),
    actived_flag INT(1) DEFAULT 1 COMMENT '0: not active, 1: actived',
    reset_password_token VARCHAR(100),
    updated DATETIME,
    created DATETIME
);

-- Table: subjects
CREATE TABLE subjects (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250),
    avatar VARCHAR(250) COMMENT 'name of avatar file (don’t store path of file in DB)',
    description TEXT,
    school_year CHAR(10) COMMENT 'code of school_year',
    updated DATETIME,
    created DATETIME
);

-- Table: teachers
CREATE TABLE teachers (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250),
    avatar VARCHAR(250) COMMENT 'name of avatar file (don’t store path of file in DB)',
    description TEXT,
    specialized CHAR(10) COMMENT 'code of specialized (chuyên ngành)',
    degree CHAR(10) COMMENT 'code of degree (bằng cấp)',
    updated DATETIME,
    created DATETIME
);

-- Table: students
CREATE TABLE students (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250),
    avatar VARCHAR(250) COMMENT 'name of avatar file (don’t store path of file in DB)',
    description TEXT,
    updated DATETIME,
    created DATETIME
);

-- Table: scores
CREATE TABLE scores (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    student_id INT(10),
    teacher_id INT(10),
    subject_id INT(10),
    score INT(2) DEFAULT 0,
    description TEXT,
    updated DATETIME,
    created DATETIME,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Default Admin User (login_id: admin, Password: 123456)
INSERT INTO admins (login_id, password, actived_flag, created) VALUES ('admin', MD5('123456'), 1, NOW());