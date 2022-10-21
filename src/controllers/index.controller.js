const { updateDocs } = require("../helpers/updateDocs");

const homePage = (req, res) => {
    res.render("index");
};

const syncData = async (req, res) => {
    try {
        await updateDocs();

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


module.exports = {
    homePage,
    syncData,
};
