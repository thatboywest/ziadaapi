const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signup', upload.fields([{ name: 'profilePhoto' }, { name: 'backgroundPhoto' }]), userController.signup);

router.get('/user/profile', authenticateToken, userController.getUserProfile);
router.get('/user/all-employee',userController.getAllEmployees);
router.get('/user/:id',  userController.getUserById);
router.put('/user/:id', authenticateToken, upload.fields([{ name: 'profilePhoto' }, { name: 'backgroundPhoto' }]), userController.updateUserById);
router.delete('/user/:id', authenticateToken, userController.deleteUserById);

module.exports = router;
