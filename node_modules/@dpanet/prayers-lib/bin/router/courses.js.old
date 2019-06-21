const express = require('express');
const router = express.Router();
const Joi= require('joi');
const startupDebugger = require('debug')('app:startup');

var courses=[{id:1,name:"omar"}];
router.get('/',(req,res)=>{
    
    res.send(courses);
    startupDebugger(courses);
});
router.post('/',(req,res)=>
{   
    const {error} = validaObject(req.body);
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }
    const course = {
        id:courses.length +1,
        name: req.body.name
    };
    courses.push(course);
    res.send(courses);
    startupDebugger(courses);
});


router.put('/:id',(req,res)=>
{   
     const course = courses.find(c=>c.id === parseInt(req.params.id));
     if(!course)
     {
         res.status(404).send('the course with give ID is not available');
         return;
     }
    const {error} = validaObject(req.body);
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name= req.body.name;
    res.send(courses);
    startupDebugger(courses);
});
function validaObject(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    const result = Joi.validate(course, schema);
    return result;
}
module.exports = router;
