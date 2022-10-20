const { doc, setDoc, updateDoc, getDocs, collection } = require("firebase/firestore");
const { firebaseStore } = require("../config/firebase");
const { odoo } = require("../config/odoo");

const createDocs = (records, recordsLocation) => {
    records.forEach(async (r) => {
        const locations = [];
        recordsLocation.forEach((rl) => {
            if (rl.product_id[0] === r.id) {
                locations.push({
                    location_id: rl.location_id[0],
                    location_name: rl.location_id[1],
                    quantity: rl.quantity,
                });
            }
        });
        await setDoc(doc(firebaseStore, "products", r.id.toString()), {
            id: r.id,
            name: r.display_name,
            price: r.list_price,
            stock: r.qty_available,
            locations,
        });
    });
};

const updateDB = async () => {
    const docsData = [], docsUpdated = [];
    await odoo.connect();
    const records = await odoo.searchRead(`product.template`);
    const docs = await getDocs(collection(firebaseStore, "products"));
    docs.forEach((d) => docsData.push(d.data()));
    records.forEach(async (r) => {
        if ( r.display_name.includes("DISP") || r.display_name.includes("LCD") || r.display_name.includes("TOUCH")) {
            const docActual = docsData.find((d) => d.id === r.id);
            if (docActual) {
                if (docActual.price !== r.list_price) {
                    docsUpdated.push({
                        type: "Actualizado",
                        name: r.display_name,
                        pricePrevious: docActual.price,
                        priceActual: r.list_price,
                    });
                    await updateDoc(
                        doc(firebaseStore, "products", docActual.id.toString()),
                        {
                            ...docActual,
                            price: r.list_price,
                        }
                    );
                }
            } else {
                docsUpdated.push({
                    type: "Nuevo",
                    name: r.display_name,
                    pricePrevious: "Sin precio.",
                    priceActual: r.list_price,
                });
                await setDoc(doc(firebaseStore, "products", r.id.toString()), {
                    id: r.id,
                    name: r.display_name,
                    price: r.list_price,
                    stock: r.qty_available,
                });
            }
        }
    });
    return docsUpdated;
};

module.exports = {
    createDocs,
    updateDB
};
