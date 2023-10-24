import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "@/firebase/config";

const firestore = getFirestore(app);

const addRequests = async (data) => {
  await addDoc(collection(firestore, "requests"), data);
};

export default addRequests;
