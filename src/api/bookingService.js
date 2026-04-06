import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const bookingCollection = collection(db, "bookings");

// CREATE BOOKING
export const createBooking = async (bookingData) => {
    const docRef = await addDoc(bookingCollection, bookingData);
    return { id: docRef.id, ...bookingData };
};

// GET BOOKINGS BY USER
export const getUserBookings = async (userId) => {
    const q = query(bookingCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};