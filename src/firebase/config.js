import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCD8IAbgoMm6EOpE7ADui_FqL_M6pqT0VQ",
  authDomain: "crm-project-479c4.firebaseapp.com",
  projectId: "crm-project-479c4",
  storageBucket: "crm-project-479c4.appspot.com",
  messagingSenderId: "992614017033",
  appId: "1:992614017033:web:8cef6b7a74fab37132b0d8"
};

const app = initializeApp(firebaseConfig);
export {app}
