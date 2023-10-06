import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDYSEr2LlcQZ6CAk3_5MerBmlUQhfAvl5Q",
  authDomain: "crm-trkv.firebaseapp.com",
  projectId: "crm-trkv",
  storageBucket: "crm-trkv.appspot.com",
  messagingSenderId: "182146763135",
  appId: "1:182146763135:web:64eb0e86bdbe144f63324a"
};

const app = initializeApp(firebaseConfig);
export {app}