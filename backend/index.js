const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

// const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200,
// };

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors(corsOptions));
app.use(cors());

app.use(session({
    secret: process.env.SECRET_OR_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 3600000},
}));

app.use(passport.initialize());
app.use(passport.session());
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
app.use('/admin', adminRoutes);

// app.use('/events', eventRoutes);

// app.use((error, req, res, next) => {
//     const status = error.status || 500;
//     const message = error.message || 'Something went wrong.';
//     res.status(status).json({ message: message });
// });

app.listen(8080, () => {
    console.log('Server running on port 8080.'); 
});