import { getFirestore, query, collection, getDocs } from "firebase/firestore";
import { app } from "./config";

const firestore = getFirestore(app);
let mailList = [];
let createId = 0;

export const createFunc = async () => {
  mailList = [];
  const q = query(collection(firestore, "projects"));
  await getDocs(q).then((snapshot) => {

    snapshot.forEach((item) => {
      mailList.push(item.data());
      createId = mailList.length;
        console.log("LE : ",  mailList.length);
        console.log("CA : ",  createId)

    });
  });
}; 
createFunc();
// console.log("CI Dis : ",  createId)
// export default createId;

