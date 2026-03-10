import { auth, db } from "../firebase.js";

const COLLECTION = "students";

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
/** Initialize seed data on first run */

export const studentService = {
  async getStudents(grade){
    if(grade === "All"){
      const q = query(collection(db,"students"),where("schoolId","==",auth.currentUser.uid),);
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc)=>({ _id: doc.id, ...doc.data()}))
    } else{
      console.log("fetcing data for: ", grade)
      const q = query(collection(db,"students"),where("schoolId","==",auth.currentUser.uid),where("grade","==",grade));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc)=>({ _id: doc.id, ...doc.data()}))
    }
  },

  async addStudent(data) {
    return addDoc(collection(db, COLLECTION), { ...data, fees: {}, schoolId: auth.currentUser.uid });
  },

  async updateStudent(id, data) {
    return updateDoc(doc(db, COLLECTION, id), data);
  },

  async deleteStudent(id) {
    return deleteDoc(doc(db, COLLECTION, id));
  },

};
