const { Router } = require('express');
const { homePage, syncData } = require('../controllers/index.controller');

const router = Router();

router.get('/', homePage);

router.get('/updated', syncData)

module.exports = {
    router
}