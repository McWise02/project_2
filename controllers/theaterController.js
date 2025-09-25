require("dotenv").config();
const database = require("../database/theaters.js");
const Theater = require("../models/theater.js");

// GET /theaters
const getAllTheaters = async (req, res, next) => {
  try {
    const data = await database.getAll();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Theaters", error: error.message });
  }
};

// GET /theaters/:id
const getTheater = async (req, res, next) => {
  try {
    const theaterId = req.params.id;
    const data = await database.get(theaterId);
    console.log(data);

    if (!data) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Theater", error: error.message });
  }
};

// POST /theaters
async function createTheater(req, res, next) {
  try {
    const theater = Theater.fromJsonCreate(req.body);
    const result = await database.create(theater);

    res.status(201).json({
      message: "Theater created successfully",
      theaterId: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error Creating Theater",
      error: err.message,
    });
  }
}

// PUT/PATCH /theaters/:id
const updateTheater = async (req, res, next) => {
  try {
    const { id } = req.params; // id from URL
    const theater = Theater.fromJsonUpdate({ ...req.body, id }); // inject id

    const result = await database.update(theater);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Theater not found" });
    }

    return res.status(200).json({
      message: "Theater updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating theater", error: error.message });
  }
};

// DELETE /theaters/:id
const deleteTheater = async (req, res, next) => {
  try {
    const theaterId = req.params.id;
    const result = await database.deleteOne(theaterId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res
      .status(200)
      .json({ message: "Theater deleted successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Theater", error: error.message });
  }
};

module.exports = {
  getAllTheaters,
  getTheater,
  createTheater,
  updateTheater,
  deleteTheater,
};
