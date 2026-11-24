const firebaseConfig = {
  apiKey: "AIzaSyBTYxjOj5yBB1oNGe_UF4ke8-gWPrPCUxw",
  authDomain: "ghaith-e05b3.firebaseapp.com",
  databaseURL: "https://ghaith-e05b3-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "ghaith-e05b3",
  storageBucket: "ghaith-e05b3.firebasestorage.app",
  messagingSenderId: "954998748764",
  appId: "1:954998748764:web:d02470d03709eb02a9d899",
  measurementId: "G-L41LYM12MV"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const auth = firebase.auth();
