import { getFirestore,query,collection,getDocs } from "firebase/firestore";
import {app} from './config';

const firestore = getFirestore(app);
const customerList = [];
async function getCustomer()  {
    const q = query(collection(firestore,("customers")));
    await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
            customerList.push(item.data());
        })
    });
}

getCustomer();

export default customerList;
