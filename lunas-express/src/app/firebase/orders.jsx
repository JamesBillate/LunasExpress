import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export async function createOrder(uid, cartItems, total) {
  const orderRef = collection(db, "orders");

  await addDoc(orderRef, {
    uid,
    items: cartItems,
    total,
    createdAt: serverTimestamp(),
  });
}