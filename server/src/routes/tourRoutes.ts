import express from 'express'
import { getAllTours, createTour, getSingleTour, updateTour, deleteTour, checkId, checkBody} from '../controllers/tourController'

const router = express.Router()

router.param('id', checkId)

// /api/v1/tours
router.route('/')
    .get(getAllTours)
    .post(checkBody ,createTour)

router.route('/:id')
.get(getSingleTour)
.patch(updateTour)
.delete(deleteTour)

export default router