const { collection, getDocs, deleteDoc } = require("firebase/firestore");
const { firebaseStore } = require("../config/firebase");

const dropCollections = async() => {
    const docs = await getDocs(collection(firebaseStore, "products"));
    docs.forEach(doc => deleteDoc(doc.ref));
};

module.exports = {
    dropCollections,
};
