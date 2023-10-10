import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "@/firebase/config";

const firestore = getFirestore(app);

const saveProject = async (data) => {
  await addDoc(collection(firestore, "projects"), data);
};

export default saveProject;
