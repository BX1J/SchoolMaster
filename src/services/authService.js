import { auth, db } from '../firebase.js';

const COLLECTION = 'users';
const SESSION_KEY = 'sms_session';

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";


export const authService = {
async login(username, password) {
    const q = query(
      collection(db, COLLECTION), 
      where('username', '==', username), 
      where('password', '==', password)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('Invalid credentials');
    
    const userDoc = snapshot.docs[0];
    return { _id: userDoc.id, ...userDoc.data() };
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  async getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  async createStaff(username, password) {
  const q = query(collection(db, COLLECTION), where('username', '==', username));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) throw new Error('Username already exists');
  
  return addDoc(collection(db, COLLECTION), { 
    username, 
    password, 
    role: 'staff',
    schoolId: auth.currentUser.uid // <-- THE DEADBOLT
  });
},


 async getStaffList() {
  const q = query(
    collection(db, COLLECTION), 
    where('role', '==', 'staff'),
    where('schoolId', '==', auth.currentUser.uid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
},

  async deleteStaff(id) {
    return deleteDoc(doc(db, COLLECTION, id));
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await getDoc(doc(db, COLLECTION, userId));
    if (!user) throw new Error('User not found');
    if (user.password !== currentPassword) throw new Error('Current password is incorrect');
    if (newPassword.length < 4) throw new Error('New password must be at least 4 characters');
    await updateDoc(doc(db, COLLECTION, userId), { password: newPassword });
  },
};
