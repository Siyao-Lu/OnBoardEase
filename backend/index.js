const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     next();
// });

// passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// mongoDB connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB.'))
    .catch((error) => console.log('Connection failed:', error));

// routes
app.use('/auth', authRoutes);

// app.use('/events', eventRoutes);

// app.use((error, req, res, next) => {
//     const status = error.status || 500;
//     const message = error.message || 'Something went wrong.';
//     res.status(status).json({ message: message });
// });

app.listen(8080, () => {
    console.log('Server running on port 8080.'); 
});