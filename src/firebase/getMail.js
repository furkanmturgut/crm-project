import { getFirestore,query,collection,getDocs } from "firebase/firestore";
import { app } from "./config";

const firestore = getFirestore(app);
const mailList = [];
const getMail = async () => {
    const q = query(collection(firestore,"mailList"));
    await getDocs(q).then((snapshot)=> {
        snapshot.forEach((item)=> {
            mailList.push(item.data());
        })
    })
}

export default getMail;