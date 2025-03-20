const ComboPack = require('../models/ComboPack');

// Create a new ComboPack
// Create a new ComboPack
const createComboPack = async (req, res) => {
  try {
    const { comboPackName, stores, offerPercentage } = req.body; // Removed price from body

    if (!stores || stores.length === 0) {
      return res.status(400).json({ message: 'Stores are required.' });
    }

    // Calculate the total price per store
    const totalPricePerStore = stores.reduce((sum, store) => sum + store.pricePerStore, 0);

    // Apply the offer percentage to get the final price
    const discount = (offerPercentage / 100) * totalPricePerStore;
    const price = totalPricePerStore - discount;

    const newComboPack = new ComboPack({
      comboPackName,
      stores,
      offerPercentage,
      price, // Calculated price
    });

    const savedComboPack = await newComboPack.save();
    res.status(201).json(savedComboPack);
  } catch (error) {
    console.error('Error creating combo pack:', error);
    res.status(500).json({ message: 'Error creating combo pack', error });
  }
};
const getComboPack = async (req, res) => {
  try {
    const comboPack = await ComboPack.findById(req.params.id).populate('stores.store'); // Populate store details
    if (!comboPack) {
      return res.status(404).json({ message: 'Combo pack not found' });
    }
    res.status(200).json(comboPack);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching combo pack', error });
  }
};

// Get all ComboPacks
// Get all ComboPacks
const getAllComboPack = async (req, res) => {
  try {
    const comboPacks = await ComboPack.find().populate('stores.store');
    res.status(200).json(comboPacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching combo packs', error });
  }
};


// Update an existing ComboPack
const updateComboPack = async (req, res) => {
  try {
    const { comboPackName, stores, offerPercentage } = req.body; // Removed price from body

    if (!comboPackName) {
      return res.status(400).json({ message: 'Combo Pack Name is required.' });
    }
    if (!stores || stores.length === 0) {
      return res.status(400).json({ message: 'Stores are required.' });
    }

    // Prepare stores for update with pricePerStore validation
    const formattedStores = stores.map(store => {
      if (!store.store) {
        throw new Error('Store ID is required for each store.');
      }
      if (!store.pricePerStore && store.pricePerStore !== 0) {
        throw new Error('Price per store is required for each store.');
      }
      return {
        store: store.store, // Store ID
        level: store.level,
        pricePerStore: store.pricePerStore, // Include pricePerStore
      };
    });

    // Calculate the total price per store
    const totalPricePerStore = formattedStores.reduce((sum, store) => sum + store.pricePerStore, 0);

    // Apply the offer percentage to get the final price
    const discount = (offerPercentage / 100) * totalPricePerStore;
    const price = totalPricePerStore - discount;

    const updatedComboPack = await ComboPack.findByIdAndUpdate(
      req.params.id,
      { comboPackName, stores: formattedStores, offerPercentage, price }, // Updated price and offerPercentage
      { new: true, runValidators: true }
    );

    if (!updatedComboPack) {
      return res.status(404).json({ message: 'Combo pack not found' });
    }

    res.status(200).json(updatedComboPack);
  } catch (error) {
    console.error('Error updating combo pack:', error);
    res.status(500).json({ message: 'Error updating combo pack', error: error.message });
  }
};


// Delete a ComboPack by ID
const deleteComboPack = async (req, res) => {
  try {
    const deletedComboPack = await ComboPack.findByIdAndDelete(req.params.id);

    if (!deletedComboPack) {
      return res.status(404).json({ message: 'Combo pack not found' });
    }

    res.status(200).json({ message: 'Combo pack deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting combo pack', error });
  }
};

module.exports = {
  createComboPack,
  getComboPack,
  getAllComboPack,
  updateComboPack,
  deleteComboPack,
};
