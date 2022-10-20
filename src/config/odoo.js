const Odoo = require("odoo-await");
require("dotenv").config();

const odoo = new Odoo({
    baseUrl: process.env.BASEURL,
    db: process.env.DB,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
});

module.exports = {
    odoo
};
