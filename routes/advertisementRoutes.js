const express = require('express');
const {
    createAdvertisement,
    getAdvertisement,
    getAdvertisements,
    updateAdvertisement,
    deleteAdvertisement
} = require('../controllers/advertisementController');

const router = express.Router();

router.get('/', getAdvertisements)

router.get('/:id', getAdvertisement);

// Route to create a new advertisement
router.post('/add', createAdvertisement);

// Route to update an advertisement by ID
router.put('/modify/:id', updateAdvertisement);

// Route to delete an advertisement by ID
router.delete('/advertisement/:id', deleteAdvertisement);

module.exports = router;