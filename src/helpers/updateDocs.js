const { doc, setDoc } = require("firebase/firestore");
const { firebaseStore } = require("../config/firebase");
const { odoo } = require("../config/odoo");
const { dropCollections } = require("./dropCollections");

const updateDocs = async() => {
    await odoo.connect();
    const records = await odoo.searchRead('product.template', ['|','|',['name', 'like', 'DISP'],['name', 'like', 'LCD'],['name', 'like', 'TOUCH']]);
    const recordsLocation = await odoo.searchRead('stock.quant', [['location_id','!=',14],['location_id','!=',5],['location_id','!=',4]]);
    await dropCollections();
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
    console.log('Actualizados');
};


module.exports = {
    updateDocs,
};
