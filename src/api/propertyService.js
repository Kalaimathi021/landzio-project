import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, getDoc, doc, addDoc, deleteDoc } from "firebase/firestore";

const propertyCollection = collection(db, "properties");

// Get all properties
export const getProperties = async () => {
    const snapshot = await getDocs(propertyCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// Get property by ID
export const getPropertyById = async (id) => {
    const docRef = doc(db, "properties", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
};

// Add property
export const addProperty = async (property) => {
    try {
        const docRef = await addDoc(propertyCollection, property);
        return { id: docRef.id, ...property };
    } catch (error) {
        console.error("Error adding property:", error);
        throw error;
    }
};

// Delete property
export const deleteProperty = async (id) => {
    try {
        await deleteDoc(doc(db, "properties", id));
        return true;
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }
};