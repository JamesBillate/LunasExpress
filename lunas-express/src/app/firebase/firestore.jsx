import { db } from "./config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const createOrder = async  (userId, cartItems, total) => {
    try {
        const docref = await addDoc(collection(db, "orders"), {
            userId,
            cartItems,
            total,
            createdAt: Timestamp.now(),
        });
        return docref.id;
    } catch (error) {
        console.error("Error creating order: ", error);
        throw error;
    }
}

export const saveOrder = async (orderData) => {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
        ...orderData,
        createdAt:Timestamp.now(),
    });
    return docRef.id;
}