const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();
const Joi = require('joi');
const logger = require('./middleware/logger')
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db'); 
const courses = require('./routes/courses');
const home = require('./routes/home');

app.use('/api/courses', courses);
app.use('/home', home);
//console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//console.log(`app: ${app.get('env')}`);
app.set('view engine', 'pug')
app.use(express.json());
app.use(express.urlencoded({extened : true}));
app.use(express.static('public'));
//app.use(logger);

app.use(helmet());
console.log('Application Name:' + config.get('name'));
console.log('Application Name:' + config.get('mail.host'))
if(app.get('env') == 'development') {
    app.use(morgan('tiny'));
    startupDebugger('morgan logging');
}

dbDebugger('connected to the database');


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`Listening on port ${port}`));