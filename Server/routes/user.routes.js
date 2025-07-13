const express = require('express');
const userController=require("../controllers/userController")
const router = express.Router();
const { auth, isAdmin } = require('../middlewares/authMiddleware');

router.get("/", auth,isAdmin,userController.getUsers)
router.post('/register', userController.register);
router.post('/login',userController.login)
router.put('/', auth, isAdmin, userController.updateUser)
router.delete('/:id', auth, isAdmin, userController.deleteUser)
router.get('/check-user', userController.checkUser);

module.exports = router;
