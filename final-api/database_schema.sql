-- Database schema for PostgreSQL

-- Create admins table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    login_id VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    actived_flag INTEGER DEFAULT 1,
    reset_password_token VARCHAR(100),
    updated TIMESTAMP,
    created TIMESTAMP
);

-- Create subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250),
    avatar VARCHAR(250),
    description TEXT,
    school_year CHAR(10),
    updated TIMESTAMP,
    created TIMESTAMP
);

-- Create teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250),
    avatar VARCHAR(250),
    description TEXT,
    specialized CHAR(10),
    degree CHAR(10),
    updated TIMESTAMP,
    created TIMESTAMP
);

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250),
    avatar VARCHAR(250),
    description TEXT,
    updated TIMESTAMP,
    created TIMESTAMP
);

-- Create scores table
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    student_id INTEGER,
    teacher_id INTEGER,
    subject_id INTEGER,
    score INTEGER DEFAULT 0,
    description TEXT,
    updated TIMESTAMP,
    created TIMESTAMP
);

-- Add foreign key constraints for scores table
ALTER TABLE scores ADD CONSTRAINT fk_scores_student FOREIGN KEY (student_id) REFERENCES students(id);
ALTER TABLE scores ADD CONSTRAINT fk_scores_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id);
ALTER TABLE scores ADD CONSTRAINT fk_scores_subject FOREIGN KEY (subject_id) REFERENCES subjects(id);