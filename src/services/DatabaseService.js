import pool from '../config/database.js';

// User operations
export const UserService = {
  async createUser(userData) {
    const { name, email, cnic, password, role, work_mode } = userData;
    const query = `
      INSERT INTO users (name, email, cnic, password, role, work_mode)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, email, cnic, password, role, work_mode];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getUserById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async updateUser(id, userData) {
    const { name, email, cnic, role, work_mode, approved } = userData;
    const query = `
      UPDATE users 
      SET name = $1, email = $2, cnic = $3, role = $4, work_mode = $5, approved = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [name, email, cnic, role, work_mode, approved, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAllUsers() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
};

// Attendance operations
export const AttendanceService = {
  async createAttendance(attendanceData) {
    const { user_id, check_in, check_out, break_time, date } = attendanceData;
    const query = `
      INSERT INTO attendance (user_id, check_in, check_out, break_time, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [user_id, check_in, check_out, break_time, date];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAttendanceByUser(userId, date) {
    const query = 'SELECT * FROM attendance WHERE user_id = $1 AND date = $2';
    const result = await pool.query(query, [userId, date]);
    return result.rows[0];
  },

  async getUserAttendance(userId, startDate, endDate) {
    const query = `
      SELECT * FROM attendance 
      WHERE user_id = $1 AND date BETWEEN $2 AND $3
      ORDER BY date DESC
    `;
    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
  }
};

// Leave operations
export const LeaveService = {
  async createLeave(leaveData) {
    const { user_id, type, reason } = leaveData;
    const query = `
      INSERT INTO leaves (user_id, type, reason)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, type, reason];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getLeavesByUser(userId) {
    const query = 'SELECT * FROM leaves WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async updateLeaveStatus(id, status) {
    const query = 'UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }
};

// Task operations
export const TaskService = {
  async createTask(taskData) {
    const { user_id, title, description } = taskData;
    const query = `
      INSERT INTO tasks (user_id, title, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, title, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getTasksByUser(userId) {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async updateTaskStatus(id, status) {
    const query = 'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }
};

// Class operations
export const ClassService = {
  async createClass(classData) {
    const { title, date, start_time, end_time, created_by } = classData;
    const query = `
      INSERT INTO classes (title, date, start_time, end_time, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [title, date, start_time, end_time, created_by];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getClassesByDate(date) {
    const query = 'SELECT * FROM classes WHERE date = $1 ORDER BY start_time';
    const result = await pool.query(query, [date]);
    return result.rows;
  },

  async getAllClasses() {
    const query = 'SELECT * FROM classes ORDER BY date DESC, start_time';
    const result = await pool.query(query);
    return result.rows;
  }
};

// Project operations
export const ProjectService = {
  async createProject(projectData) {
    const { name, assigned_to, description } = projectData;
    const query = `
      INSERT INTO projects (name, assigned_to, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [name, assigned_to, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getProjectsByUser(userId) {
    const query = 'SELECT * FROM projects WHERE assigned_to = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async updateProjectStatus(id, status) {
    const query = 'UPDATE projects SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }
}; 