const router = require('express').Router()
const userController = require('../controllers/userController')
const VerifyToken = require('../middleware/VerifyToken')
// Route for creating a new user
router.post('/register',userController.registerUser)
// Route for user login 
router.post('/login',userController.loginUser)
//authentication 
router.get('/auth',VerifyToken,userController.Authentication)

// Route for getting all users
router.get('/',userController.getAllUsers)

router.get('/user/:id',userController.getUserById);


module.exports = router