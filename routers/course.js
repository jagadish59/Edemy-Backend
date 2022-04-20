import express from 'express';

const router=express.Router();

//middleware
import { requireSignin ,isInstructor} from '../middlewares';

//controller 
import {uploadImage,create,read,addLesson,update,removeLesson,updateLesson} from '../controllers/course';
//image 
router.post('/course/upload-image',uploadImage)

// course

router.post("/course",requireSignin,isInstructor,create)
router.put('/course/:slug',requireSignin,update)
router.get('/course/:slug',requireSignin ,read)

router.put('/course/:slug/:lessonId',requireSignin,removeLesson)
//add lesson
router.post('/course/lesson/:slug/:instructorId',requireSignin,addLesson)
router.put('/course/lesson/:slug/:instructorId' , requireSignin,updateLesson)

module.exports=router;