const express = require("express");
const Movie = require("../Modal/movies");
const aws = require("aws-sdk");
const path = require('path');

const router = express.Router();

const uploadFile = async (file) => {
  try {
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const fileName = `${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET, // Ensure this environment variable is set correctly
      Key: fileName, // Unique file name
      Body: file.buffer, // File data (from multer)
      ContentType: file.mimetype, // Set the file's MIME type
    };

    const uploadResult = await s3.upload(params).promise(); // Ensure the promise is awaited

    return uploadResult;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};


const createMovie = async (req, res) => {
  try {
    const {
      body: { title, publishingYear },
      user: { id },
    } = req;
    const poster = req.file;

    if (!title || !publishingYear) {
      return res.status(400).json({ message: "Missing Required Feilds" });
    }
    const data = await uploadFile(poster);

    const newMovie = new Movie({
      user_id: id,
      title,
      publishingYear,
      poster: data.Location,
    });

    await newMovie.save();

    res.status(201).json({ movies: newMovie });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const { id } = req.user;
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 3;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ user_id: id }).skip(skip).limit(limit);
    const totalMovies = await Movie.countDocuments({ user_id: id});

    res.json({
      page,
      limit,
      totalMovies,
      totalPages: Math.ceil(totalMovies / limit),
      movies,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const editMovies = async (req, res) => {
  try {
    const {
      body: { title, publishingYear },
      params: { id },
      user,
    } = req;

    const poster = req.file;

    const data = await uploadFile(poster);

    const updatedMovie = await Movie.findByIdAndUpdate(
      { _id: id, user_id: user.id },
      { title, publishingYear, poster: data.Location },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ movies: updatedMovie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovieById = async(req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ message: "Missing id" });
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(200).json({ movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ message: "Missing id" });
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  editMovies,
  deleteMovie,
  getMovieById
};
