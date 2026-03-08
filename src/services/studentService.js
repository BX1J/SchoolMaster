import { db } from './db';
import seedStudents from '../data/seedStudents.json';
import {auth} from '../firebase.js'
const COLLECTION = 'students';

/** Initialize seed data on first run */

export const studentService = {
  async getStudents() {
    return db.query(COLLECTION, (s) => s.schoolId === auth.currentUser.uid);
  },

  async addStudent(data) {
    return db.create(COLLECTION, {
      name: data.name,
      fatherName: data.fatherName,
      phone: data.phone,
      grade: data.grade,
      feeStatus: 'Pending',
      schoolId: auth.currentUser.uid
    });
    
    
  },

  async updateStudent(id, data) {
    return db.update(COLLECTION, id, data);
  },

  async deleteStudent(id) {
    return db.remove(COLLECTION, id);
  },

  async searchStudents(query) {
    const q = query.toLowerCase();
    return db.query(COLLECTION, (s) => s.name.toLowerCase().includes(q) &&  s.schoolId === auth.currentUser.uid);
  },
};
