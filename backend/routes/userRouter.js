const express = require('express')
const router = express.Router()
const passport = require('passport');

const userController = require('../controllers/userController')
const verifyToken = require("../middlewares/verifyToken")
const upload = require("../middlewares/uploadImage")
const isUser = require("../middlewares/isUser");
const isAdmin = require("../middlewares/isAdmin");

require('../config/passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:5173/login'
}), (req, res) => {
    const {token, isNewUser} = req.user;
    res.cookie('token', token, {
        maxAge: 600000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    const status = isNewUser ? 'signup_success' : 'login_success';
    res.redirect('http://localhost:5173');
});

// register 
router.route('/register').post(upload.single('image'),userController.register)
// login
router.route('/login').post(userController.login)
// logout
router.route('/logout').post(userController.logout)
//send verify otp
router.route('/send-verify-otp').post(verifyToken, isUser, userController.sendVerifyOtp)
//verify email
router.route('/verify-email').post(verifyToken, isUser, userController.verifyEmail)
//send reset otp
router.route('/send-reset-otp').post(isUser, userController.sendResetOtp)
//reset password
router.route('/reset-password').post(userController.resetPassword)
//update user
router.route('/update-user').put(verifyToken, isUser, upload.single('image'), userController.updateUser)
// get user data
router.route('/get-user').get(verifyToken, userController.userData)
//authentication
router.route('/is-auth').get(verifyToken, userController.isAuthenticated)
// get all users
router.route('/get-all-users').get(verifyToken, isAdmin, userController.getAllUsers)

module.exports = router;