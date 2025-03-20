const Store = require('../models/Store.js'); // Adjust the path as needed

// Add a new store
exports.addStore = async (req, res) => {
    try {
        const store = new Store(req.body);
        const savedStore = await store.save();
        res.status(201).json(savedStore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing store by ID
exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStore = await Store.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json(updatedStore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a store by ID
exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStore = await Store.findByIdAndDelete(id);
        if (!deletedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single store by ID
exports.getStore = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all stores
exports.getStores = async (req, res) => {
    try {
        const stores = await Store.find();
        res.status(200).json(stores);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.test = async (req, res) => {
    try {
        res.status(200).send("Path Working");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};