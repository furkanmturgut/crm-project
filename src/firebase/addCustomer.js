import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "@/firebase/config";

const firestore = getFirestore(app);

const addCustomer = async (data) => {
  await addDoc(collection(firestore, "customers"), data);
};

export default addCustomer;
