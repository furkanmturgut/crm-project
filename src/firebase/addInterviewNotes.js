import { getFirestore,addDoc,collection } from "firebase/firestore";
import {app} from "./config";

const firestore = getFirestore(app);

const addInterviewNotes = async (data) => {
    await addDoc(collection(firestore,"interviewNotes",data));
}

export default addInterviewNotes;