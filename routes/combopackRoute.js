const router = require('express').Router()
const combopackController = require('../controllers/comboPackController')



router.post('/create',combopackController.createComboPack)
router.delete('/delete/:id',combopackController.deleteComboPack)
router.put('/update/:id',combopackController.updateComboPack)
router.get('/getcombopack/:id',combopackController.getComboPack)
router.get('/getcombopacks',combopackController.getAllComboPack)
module.exports = router