const express = require("express");
const Movie = require("../Modal/movies");

const router = express.Router();

const createMovie = async (req, res) => {
  try {
    const {
      body: { title, publishingYear },
      user: { id },
    } = req;
    const poster = req.file ? req.file.path : null;

    if (!title || !publishingYear) {
      return res.status(400).json({ message: "Missing Required Feilds" });
    }

    const newMovie = new Movie({
      user_id: id,
      title,
      publishingYear,
      poster,
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

    const movies = await Movie.find({ user_id: id });

    res.json({ movies: movies });
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

    const poster = req.file ? req.file.path : null;

    const updatedMovie = await Movie.findByIdAndUpdate(
      { _id: id, user_id: user.id },
      { title, publishingYear, poster },
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
};
