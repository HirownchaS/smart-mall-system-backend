const express = require('express');
const {
    addStore,
    getStore,
    getStores,
    updateStore,
    deleteStore,
    test
} = require('../controllers/store.controller');

const router = express.Router();

router.get('/test',test)

// Route to create a new advertisement
router.post('/add', addStore);

//Route to get a store 
router.get('/:id',getStore);

//Route to get all Stores
router.get('/',getStores);

// Route to update an advertisement by ID
router.put('/update/:id', updateStore);

// Route to delete an advertisement by ID
router.delete('/:id', deleteStore);

module.exports = router;