import mysql from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
}

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'exam_system',
  connectionLimit: 10
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
        phone VARCHAR(20),
        department VARCHAR(255),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
      )
    `);

    // Exams table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        teacher_id VARCHAR(36),
        duration INT NOT NULL, -- in minutes
        total_questions INT DEFAULT 0,
        passing_score INT DEFAULT 60,
        start_date DATETIME,
        end_date DATETIME,
        randomize_questions BOOLEAN DEFAULT TRUE,
        show_results BOOLEAN DEFAULT TRUE,
        allow_review BOOLEAN DEFAULT TRUE,
        max_attempts INT DEFAULT 1,
        status ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Questions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay') NOT NULL,
        subject VARCHAR(100),
        topic VARCHAR(100),
        difficulty ENUM('آسان', 'متوسط', 'سخت') DEFAULT 'متوسط',
        question TEXT NOT NULL,
        options JSON, -- For multiple choice questions
        correct_answer TEXT NOT NULL,
        points INT DEFAULT 1,
        explanation TEXT,
        time_estimate INT DEFAULT 2, -- in minutes
        created_by VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Exam Questions (junction table)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS exam_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        exam_id INT,
        question_id INT,
        question_order INT,
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
        UNIQUE KEY unique_exam_question (exam_id, question_id)
      )
    `);

    // Student Exam Attempts
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(36),
        exam_id INT,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitted_at TIMESTAMP NULL,
        time_spent INT, -- in seconds
        score DECIMAL(5,2),
        status ENUM('in_progress', 'submitted', 'graded') DEFAULT 'in_progress',
        answers JSON,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
      )
    `);

    // System Settings
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user if not exists
    await connection.execute(`
      INSERT IGNORE INTO users (id, name, email, password, role, created_at) 
      VALUES ('admin-001', 'مدیر سیستم', 'admin@test.com', '$2b$10$hash', 'admin', NOW())
    `);

    // Insert default system settings
    const defaultSettings = [
      ['site_name', 'سیستم آزمون‌گیری آنلاین', 'string', 'نام سایت'],
      ['allowed_login_start', '08:00', 'string', 'ساعت شروع ورود مجاز'],
      ['allowed_login_end', '15:00', 'string', 'ساعت پایان ورود مجاز'],
      ['maintenance_mode', 'false', 'boolean', 'حالت تعمیر و نگهداری'],
      ['registration_enabled', 'true', 'boolean', 'امکان ثبت نام'],
      ['max_file_size', '10', 'number', 'حداکثر حجم فایل (MB)']
    ];

    for (const [key, value, type, description] of defaultSettings) {
      await connection.execute(`
        INSERT IGNORE INTO system_settings (setting_key, setting_value, setting_type, description) 
        VALUES (?, ?, ?, ?)
      `, [key, value, type, description]);
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Helper functions for database operations
export const getUserByEmail = async (email: string) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return (rows as any[])[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const createUser = async (userData: any) => {
  try {
    const [result] = await pool.execute(`
      INSERT INTO users (id, name, email, password, role, phone, department, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      userData.id,
      userData.name,
      userData.email,
      userData.password,
      userData.role,
      userData.phone || null,
      userData.department || null
    ]);
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getSystemSetting = async (key: string) => {
  try {
    const [rows] = await pool.execute(
      'SELECT setting_value, setting_type FROM system_settings WHERE setting_key = ?',
      [key]
    );
    const setting = (rows as any[])[0];
    if (!setting) return null;

    // Parse value based on type
    switch (setting.setting_type) {
      case 'boolean':
        return setting.setting_value === 'true';
      case 'number':
        return parseFloat(setting.setting_value);
      case 'json':
        return JSON.parse(setting.setting_value);
      default:
        return setting.setting_value;
    }
  } catch (error) {
    console.error('Error fetching system setting:', error);
    return null;
  }
};

export const updateSystemSetting = async (key: string, value: any) => {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    await pool.execute(
      'UPDATE system_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
      [stringValue, key]
    );
    return true;
  } catch (error) {
    console.error('Error updating system setting:', error);
    return false;
  }
};