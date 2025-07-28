// @ts-ignore
import { db } from "../lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export interface BillData {
  companyName: string;
  amount: number;
  dueDate: Date;
  category: string;
  status?: string;
  priority?: string;
  icon?: string;
  isPaid?: boolean;
}

export interface FirestoreBill extends BillData {
  id: string;
}

// Add a new bill to Firestore
export async function addBill(billData: Omit<BillData, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, "bills"), {
    ...billData,
    dueDate: billData.dueDate.toISOString() // Convert Date to string for Firestore
  });
  return docRef.id;
}

// Get all bills from Firestore
export async function getBills(): Promise<FirestoreBill[]> {
  const querySnapshot = await getDocs(collection(db, "bills"));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(), // Convert string back to Date
      isPaid: data.isPaid || false
    } as FirestoreBill;
  });
}