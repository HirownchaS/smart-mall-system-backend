const Advertisement = require('../models/Advertisement');

// Create a new advertisement
const createAdvertisement = async (req, res) => {
    try {
        const ad = new Advertisement(req.body);
        await ad.save();
        res.status(201).send(ad);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAdvertisements = async (req, res) => {
    try {
        const ads = await Advertisement.find();
        res.status(200).json(ads);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getAdvertisement = async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        if (!ad) {
            return res.status(404).send();
        }
        res.status(200).send(ad);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Update an advertisement by ID
const updateAdvertisement = async (req, res) => {
    try {
        const ad = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ad) {
            return res.status(404).send();
        }
        res.status(200).send(ad);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete an advertisement by ID
const deleteAdvertisement = async (req, res) => {
    try {
        const ad = await Advertisement.findByIdAndDelete(req.params.id);
        if (!ad) {
            return res.status(404).send();
        }
        res.status(200).send(ad);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createAdvertisement,
    getAdvertisement,
    getAdvertisements,
    updateAdvertisement,
    deleteAdvertisement
};