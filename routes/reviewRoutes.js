const express = require('express')
const reviewController = require('./../Controller/reviewController')
const authController = require('./../Controller/authController')

const router = express.Router({ mergeParams: true });

//router.use(authController.protect)

router.route('/').get(function (req, res) { reviewController.getAllReviews }).post(authController.protect, authController.restrictTo('user'),
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview)

router.route('/:id').get(reviewController.getReview).patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)

module.exports = router
