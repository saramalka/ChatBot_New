const express = require('express');
const userController=require("../controllers/userController")
const router = express.Router();
const { auth, isAdmin } = require('../middlewares/authMiddleware');

router.get("/", auth,isAdmin,userController.getUsers)
router.put('/', auth, isAdmin, userController.updateUser)
router.delete('/:id', auth, isAdmin, userController.deleteUser)


module.exports = router;
