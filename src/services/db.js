/**
 * Database Adapter Interface (localStorage implementation)
 *
 * This module provides a generic collection-based storage layer.
 * When migrating to Firebase, replace this file with a Firebase adapter
 * that implements the same interface:
 *   - getAll(collection) → Promise<Array>
 *   - getById(collection, id) → Promise<Object|null>
 *   - create(collection, doc) → Promise<Object>
 *   - update(collection, id, data) → Promise<Object>
 *   - remove(collection, id) → Promise<void>
 *   - query(collection, filterFn) → Promise<Array>
 *   - seed(collection, seedData) → Promise<void>
 */
import { db as firestore } from "../firebase.js";
import {
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";

const getCollection = async (collectionName) => {
  const ref = collection(firestore, collectionName);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    _id: doc.id,
  }));
};

const PREFIX = "sms_db_";
const SEEDED_KEY = "sms_seeded_";

export const db = {
  /** Get all documents in a collection */
  async getAll(collectionName) {
    const ref = collection(firestore, collectionName);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      _id: doc.id,
    }));
  },

  /** Get a single document by _id */
  async getById(collection, id) {
    const docs = await getCollection(collection);
    return docs.find((d) => d._id === id) || null;
  },

  /** Create a new document (auto-generates _id & timestamps if missing) */

  async create(collectionName, payload) {
    const ref = collection(firestore, collectionName);
    const dataToSave = { ...payload, createdAt: new Date().toISOString() };
    const docRef = await addDoc(ref, dataToSave);
    return { ...dataToSave, _id: docRef.id };
  },

  /** Update a document by _id (merges fields, updates updatedAt) */
  async update(collectionName, id, payload) {
    const docRef = doc(firestore, collectionName, id);
    const dataToSave = { ...payload, updatedAt: new Date().toISOString() };
    await updateDoc(docRef, dataToSave);
    return { ...dataToSave, _id: id };
  },

  /** Remove a document by _id */
  async remove(collectionName, id) {
    const docRef = doc(firestore, collectionName, id);
    await deleteDoc(docRef);
  },

  /** Query documents with a filter function */
  async query(collection, filterFn) {
    const docs = await getCollection(collection);
    return docs.filter(filterFn);
  },
};
