import express from 'express'
import { getAllTours, 
    createTour, getSingleTour, updateTour, deleteTour, getFiveTop, 
    getToursStats, getMonthlyPlan} from '../controllers/tourController'
import { protect, restrictTo } from '../controllers/authController'

const router = express.Router()

// router.param('id', checkId)

// /api/v1/tours
router.route('/top-5-cheap').get(getFiveTop, getAllTours)
router.route('/get-tour-stats').get(getToursStats)
router.route('/get-monthly-plan/:year').get(getMonthlyPlan)

router.route('/')
    .get(getAllTours)
    .post(createTour)

router.route('/:id')
.get(getSingleTour)
.patch(updateTour)
.delete(protect, restrictTo, deleteTour)
 
export default router