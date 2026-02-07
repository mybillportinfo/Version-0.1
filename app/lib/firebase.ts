import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, Timestamp, Firestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, browserLocalPersistence, setPersistence, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return _app;
}

function getFirebaseDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getFirebaseApp());
  return _db;
}

function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  if (typeof window !== 'undefined') {
    setPersistence(_auth, browserLocalPersistence).catch(console.error);
  }
  return _auth;
}

export interface Bill {
  id?: string;
  userId: string;
  providerName: string;
  billType: string;
  amount: number;
  dueDate: Date;
  createdAt: Date;
}

export function registerUser(email: string, password: string) {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password).then(r => r.user);
}

export function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password).then(r => r.user);
}

export function logoutUser() {
  return signOut(getFirebaseAuth());
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function addBill(userId: string, bill: Omit<Bill, 'id' | 'userId' | 'createdAt'>) {
  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to add bills');
  }
  
  await currentUser.getIdToken(true);
  
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, "bills"), {
    ...bill,
    userId,
    dueDate: Timestamp.fromDate(new Date(bill.dueDate)),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function fetchBills(userId: string): Promise<Bill[]> {
  try {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return [];
    }
    
    await currentUser.getIdToken(true);
    
    const db = getFirebaseDb();
    const q = query(
      collection(db, "bills"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    
    const bills = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        providerName: data.providerName,
        billType: data.billType,
        amount: data.amount,
        dueDate: data.dueDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
    return bills.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  } catch (error) {
    console.error('Firestore fetchBills error:', error);
    throw error;
  }
}

export async function deleteBill(billId: string) {
  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to delete bills');
  }
  
  await currentUser.getIdToken(true);
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "bills", billId));
}

export type { User };
