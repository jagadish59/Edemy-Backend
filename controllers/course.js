const User = require('../models/user');
const Course = require('../models/Course');
import slugify from 'slugify';



export const uploadImage= async(req,res)=>{

    const {image} =req.body;


    console.log(image)
    res.status(200).send('image uplaod success fully to firebase');

     
}


export const create=async (req,res)=>{
    try{



        console.log(req.body)
        const alreadyexit =await  Course.findOne({slug:slugify(req.body.name.toLowerCase())})
        console.log('already exit')
        if(alreadyexit){return res.status(400).send('This title is already exit')}

        const course= await new Course({
            slug:slugify(req.body.name),
            instructor:req.user._id,
            ...req.body,

        })

        await course.save();
        return res.status(200).send('cource crated')


    }catch(err){
        console.log(err)
        return res.status(400).send("Course creat failed try again");
    }
}


export const read=async (req,res)=>{

    try {

        const data=await Course.findOne({slug:req.params.slug}).populate('instructor','_id name').exec()
        console.log(data)
        return res.json(data);

    }catch(err){
        console.log(err);
    }
}



export const addLesson=async(req,res)=>{


    try{
        const {values,video} = req.body
        const {slug,instructorId}=req.params

    
    
        if(req.user._id!=instructorId){
            return res.status(400).send('unauthorized')
            
        }

        const update= await Course.findOneAndUpdate({slug:slug},{$push:
            {lessons:
                {title:values.title,content:values.content,video:video,slug:slugify(values.title)}}},{new:true})


     return res.status(200).send(update)
    }catch(err){
        console.log(err);
        res.status(400).send('failed videos lesson')
    }
}


export const update= async(req,res)=>{
    try{

        const {slug}=req.params
        console.log(slug)
        const course=await Course.findOne({slug})

        if(req.user._id!=course.instructor){
            return res.send('user is not authencate')

        }

        const update =await Course.findOneAndUpdate({slug},req.body,{new:true})


        res.json(update)





    }catch(err){
        console.log(err);
    }
}


export const removeLesson=async(req,res)=>{
    try{

        const {slug,lessonId}=req.params
        console.log(slug,lessonId)
        const course=await Course.findOne({slug})
        if(req.user._id!=course.instructor){
            return res.status(400).send('unauthorized ')
        }

        const updatecourse=await Course.findByIdAndUpdate(
            course._id,
            {$pull:{lessons:{_id:lessonId}},}).exec();

            res.json({ok:true}); 






    }catch(err){
        console.log(err)
    }
}




export const updateLesson=async(req,res)=>{

try{
    const{slug,instructorId}=req.params
    const {_id,title,content,video,free_preview}=req.body

    console.log(title)
    const course=await Course.findOne({slug})
    console.log(req.user._id)
    console.log(course.instructor[0]._id)
    if(course.instructor[0]._id!=req.user._id){
        return res.status(401).send('unauthorized')
    }


    const data=await Course.updateOne({'lessons._id':_id},{

        $set:{
            'lessons.$.title':title,
            'lessons.$.content':content,
            'lessons.$.video':video,
            'lessons.$.free_preview':free_preview,
        }
    },{new:true})
    console.log(data);
    res.status(200).send({ok:true})
}
catch(err){
    console.log(err)
}



}