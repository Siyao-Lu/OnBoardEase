const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

// const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

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

app.listen(8080, () => {
    console.log('Server running on port 8080.'); 
});