-- Database schema for MySQL

-- Table: users
CREATE TABLE users (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(20) UNIQUE,
    password VARCHAR(64),
    role VARCHAR(20) COMMENT 'admin, teacher, student',
    reference_id INT(10) COMMENT 'id from respective table (teachers or students), null for admin',
    actived_flag INT(1) DEFAULT 1 COMMENT '0: not active, 1: actived',
    reset_password_token VARCHAR(100),
    updated DATETIME,
    created DATETIME
);

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

-- Sample teachers
INSERT INTO teachers (name, specialized, degree, created) VALUES ('Nguyen Van A', 'MATH', 'MASTER', NOW());
INSERT INTO teachers (name, specialized, degree, created) VALUES ('Tran Thi B', 'PHYS', 'PHD', NOW());

-- Table: students
CREATE TABLE students (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250),
    avatar VARCHAR(250) COMMENT 'name of avatar file (don’t store path of file in DB)',
    description TEXT,
    updated DATETIME,
    created DATETIME
);

-- Sample students
INSERT INTO students (name, created) VALUES ('Le Van C', NOW());
INSERT INTO students (name, created) VALUES ('Pham Thi D', NOW());

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

-- Sample users
INSERT INTO users (login_id, password, role, reference_id, created) VALUES ('admin', MD5('123456'), 'admin', NULL, NOW());
INSERT INTO users (login_id, password, role, reference_id, created) VALUES ('teacher1', MD5('123456'), 'teacher', 1, NOW());
INSERT INTO users (login_id, password, role, reference_id, created) VALUES ('teacher2', MD5('123456'), 'teacher', 2, NOW());
INSERT INTO users (login_id, password, role, reference_id, created) VALUES ('student1', MD5('123456'), 'student', 1, NOW());
INSERT INTO users (login_id, password, role, reference_id, created) VALUES ('student2', MD5('123456'), 'student', 2, NOW());