const express = require('express');
const { getAllUsers, getUserById, loginUser , updateUser ,Updateposts, registerUser ,updatePlatform} = require('../controllers/userController');
const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/user', registerUser);
router.put('/users/:id',updateUser);
router.post('/checkUser', loginUser);
router.patch('/updateplatform/:id', updatePlatform);
router.get('/Updateposts/:id', Updateposts);



module.exports = router;
