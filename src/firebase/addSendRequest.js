import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "@/firebase/config";

const firestore = getFirestore(app);

const addSendRequests = async (data) => {
  await addDoc(collection(firestore, "sendRequests"), data);
};

export default addSendRequests;
