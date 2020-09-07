import express from 'express'
import { getAllTours, createTour, getSingleTour, updateTour, deleteTour,} from '../controllers/tourController'

const router = express.Router()

// router.param('id', checkId)

// /api/v1/tours
router.route('/')
    .get(getAllTours)
    .post(createTour)

router.route('/:id')
.get(getSingleTour)
.patch(updateTour)
.delete(deleteTour)

export default router