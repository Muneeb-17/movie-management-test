const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticationRoutes = require('./src/routes/auth');
const moviesRoutes = require('./src/routes/movies');

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
// app.use(cors({credentials: true, origin: "http://localhost:3000"}))
app.use(express.json())

//Routes
app.use('/', authenticationRoutes);
app.use('/movies', moviesRoutes);

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connection successfull');
}).catch((err) => console.log(err,'no connection'));

app.listen(5000, () => console.log(`Server running on port: http://localhost:5000`));