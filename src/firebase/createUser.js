import {getAuth, createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { app } from './config.js';

const auth = getAuth(app);
const createUser = (username,pass) => {
    createUserWithEmailAndPassword(auth,username,pass).then((userCredential)=> {
        const user = userCredential.user;

        return updateProfile(user,{
            displayName:'userCompany'
        });
    }).catch((error)=> {
        console.log("Kullanıcı oluşturulamadı! \nMesaj : ",error);
    });
}

export default createUser;
/*

WebStorm subscription expires on 18.10.2023. Renew your subscription to use the latest versions.
 */