const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authenticationRoutes = require('./src/routes/auth');
const moviesRoutes = require('./src/routes/movies');

require("dotenv").config();

const app = express();

app.use(express.json())
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(cors({credentials: true, origin: "https://movie-management-app-forntend.vercel.app"}))

//Routes
app.use('/', authenticationRoutes);
app.use('/movies', moviesRoutes);

mongoose.connect(`${process.env.MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connection successfull');
}).catch((err) => console.log(err,'no connection'));

app.listen(process.env.PORT, () => console.log(`Server running on port: http://localhost:${process.env.PORT}`));