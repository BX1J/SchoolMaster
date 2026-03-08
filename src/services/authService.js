import { db } from './db';
import seedUsers from '../data/seedUsers.json';

const COLLECTION = 'users';
const SESSION_KEY = 'sms_session';

/** Initialize seed data on first run */

export const authService = {
  async login(username, password) {
    const users = await db.getAll(COLLECTION);
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) throw new Error('Invalid credentials');
    const session = { _id: user._id, username: user.username, role: user.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  async getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  async createStaff(username, password) {
    const existing = await db.query(COLLECTION, (u) => u.username === username);
    if (existing.length > 0) throw new Error('Username already exists');
    return db.create(COLLECTION, {
      username,
      password,
      role: 'staff',
    });
  },

  async getStaffList() {
    const staff = await db.query(COLLECTION, (u) => u.role === 'staff');
    return staff.map(({ password, ...rest }) => rest);
  },

  async deleteStaff(id) {
    const user = await db.getById(COLLECTION, id);
    if (user && user.role === 'staff') {
      await db.remove(COLLECTION, id);
    }
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await db.getById(COLLECTION, userId);
    if (!user) throw new Error('User not found');
    if (user.password !== currentPassword) throw new Error('Current password is incorrect');
    if (newPassword.length < 4) throw new Error('New password must be at least 4 characters');
    await db.update(COLLECTION, userId, { password: newPassword });
  },
};
