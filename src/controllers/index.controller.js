const { getDocs, collection } = require("firebase/firestore");
const { firebaseStore } = require("../config/firebase");
const { odoo } = require("../config/odoo");
const { createDocs, updateDB } = require("../helpers/updateDocs");
const { dropCollections } = require("../helpers/dropCollections");

const homePage = (req, res) => {
    res.render("index");
};

const syncData = async (req, res) => {
    try {
        await odoo.connect();
        const records = await odoo.searchRead('product.template', ['|','|',['name', 'like', 'DISP'],['name', 'like', 'LCD'],['name', 'like', 'TOUCH']]);
        const recordsLocation = await odoo.searchRead('stock.quant');
        await dropCollections();
        createDocs(records, recordsLocation);

        return res.status(200).json({
            msg: "Productos actualizados.",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: error,
        });
    }
};

const countData = async(req, res) => {
    try {
        let docsData = [];
        const docs = await getDocs(collection(firebaseStore, "products"));
        docs.forEach(d => docsData.push(d.data()));
        return res.json({
            count: docs.size,
            docs: docsData
        })
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}

const updatedData = async(req, res) => {
    try {
        const docsUpdated = await updateDB();
        return res.json({
            docsUpdated
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: error.message
        })
    }
}

module.exports = {
    homePage,
    syncData,
    countData,
    updatedData
};
