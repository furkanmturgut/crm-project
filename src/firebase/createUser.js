import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { app } from "./config.js";

const auth = getAuth(app);
const createUser = (username, pass, compName) => {
  createUserWithEmailAndPassword(auth, username, pass)
    .then((userCredential) => {
      const user = userCredential.user;

      updateProfile(user, {
        displayName: compName,
      });
      signOut(auth);
    })
    .catch((error) => {
      
      console.log("Kullanıcı oluşturulamadı! \nMesaj : ", error);
    });
};



export default createUser;
