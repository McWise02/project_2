require("dotenv").config();
const database = require("../database/movies.js");


const getAllMovies = async (req, res, next) => {
    try {
        var data = await database.getAll();
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
    res.status(500).json({ message: 'Error retrieving Movies', error: error.message });
  }
};

const getMovie = async (req, res, next) => {
    try {
        const movieId = req.params.id;
        var data = await database.get(movieId);
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
    res.status(500).json({ message: 'Error retrieving Movie', error: error.message });
  }
};


async function createMovie(req, res, next) {
  try {

    const movie = Movie.fromJsonCreate(req.body);


    const result = await movieDb.create(movie);

    res.status(201).json({
      message: "Movie created successfully",
      movieId: result.insertedId
    });
  } catch (err) {
    res.status(500).json({ message: 'Error Creating Movie', error: error.message });
  }
}

const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params; // <-- get id from URL
    const movie = Movie.fromJsonUpdate({ ...req.body, id }); // <-- inject it

    const result = await database.update(movie);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.status(200).json({
      message: "Movie updated successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating movie", error: error.message });
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id
    const result = database.deleteOne(movieId);
    if (result) {
      res.status(200).json({ message: "Movie deleted successfully", result})
    }
  } catch (error) {
    res.status(500).json({message: "Error deleting Movie", error: error.message});
  }
};


module.exports = { getAllMovies, getMovie, createMovie, updateMovie, deleteMovie };