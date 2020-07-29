const express = require("express");
const userController = require("./../Controller/usercontroller");
const authController = require("./../Controller/authController");


const router = express.Router();


router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token",
  authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.get('/Me', authController.protect, userController.getMe, userController.getUser)
router.patch('/updateMe', authController.protect, userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe);

//router.use(authController.restrictTo('admin'))
router
  .route("/")
  .get(function (req, res) { userController.getAllUsers })
  .post(function (req, res) {
    userController.CreateNewUser
  });
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.UpdateUser)
  .delete(userController.deleteUser)
module.exports = router;
