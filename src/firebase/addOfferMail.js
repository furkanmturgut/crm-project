import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "@/firebase/config";

const firestore = getFirestore(app);

const addOfferMail = async (data) => {
  await addDoc(collection(firestore, "mailList"), data);
};

export default addOfferMail;