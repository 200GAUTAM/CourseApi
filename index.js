const express = require('express');
const app = express();
const Joi = require('joi');
const logger = require('./logger')
app.use(express.json());
app.use(express.urlencoded({extened : true}));
app.use(express.static('public'));
app.use(logger);

app.use(function(req, res, next) {
    console.log('Authenticating...');
   next();
});

const courses = [
 {id : 1, name:'course1'},
 {id : 2, name:'course2'},
 {id : 3, name:'course3'}
];

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}



app.get('/', (req, res) => {
    res.send('Hello world'); 
});

app.get('/api/courses', (req,res)=> {
    res.send(courses);
    //courses.find(c = > c.id === )
});


app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with given id was not found');
    /*
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);

    */

    const { error } = validateCourse(req.body);

    if(error) {
       return res.status(400).send(error.details[0].message);
    }

    course.name = req.body.name;
    res.send(course);


});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with given id was not found');

    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
});


app.get('/api/courses/:id', (req,res)=> {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with given id was not found');
    res.send(course);
});

app.post('/api/courses', (req,res) => {
   
    //console.log(result);
    const { error } = validateCourse(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
    }
    const course = {
        id: courses.length+1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});



const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`Listening on port ${port}`));