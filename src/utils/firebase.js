import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHN5rJVHvQPw8E11CoZj47gSDqh-0apLw",
  authDomain: "triptrekker-d2db8.firebaseapp.com",
  projectId: "triptrekker-d2db8",
  storageBucket: "triptrekker-d2db8.appspot.com",
  messagingSenderId: "769022367441",
  appId: "1:769022367441:web:ce12bed575f51105de17f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a reference to the file we want to download
const storage = getStorage(app);

export const getDownloadURLFromFirebaseRef = async (firebaseRef) => {
  const storageRef = ref(storage, firebaseRef);
  const url = await getDownloadURL(storageRef)
    .then((url) => {
      return url;
    })
    .catch((error) => {
      console.error(error);
    });

  return url;
};
