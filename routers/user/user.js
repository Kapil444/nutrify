const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/userController')

router.post('/signup',userController.createUser);

router.get("/get/all",userController.getAllUser);

router.post("/update",userController.updateUser);

router.delete("/delete",userController.deleteUser);

router.post("/login",userController.login);

module.exports = router;
