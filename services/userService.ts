import { doc, setDoc, getDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

interface AppUser {
  uid: string;
  name: string;
  email: string;
  balance: number;
  createdAt: Date;
}

export const createUser = async (user: AppUser) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, user);
};

export const getUserById = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return null;
  return snap.data();
};

export const updateBalance = async (uid: string, amount: number) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    balance: increment(amount),
  });
};

export const listenToUserBalance = (
  userId: string,
  callback: (balance: number) => void,
) => {
  return onSnapshot(doc(db, "users", userId), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().balance);
    }
  });
};
