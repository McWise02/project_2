const express = require("express");
const theaterController = require("../controllers/theaterController");
const {
  theaterCreateRules,
  theaterUpdateRules,
  checkTheaterData
} = require("../utils/theater-validation");

const router = new express.Router();

router.post(
  "/create",
  theaterCreateRules(),
  checkTheaterData,
  theaterController.createTheater
);

router.put(
  "/update/:id",
  theaterUpdateRules(),
  checkTheaterData,
  theaterController.updateTheater
);

router.delete("/delete/:id", theaterController.deleteTheater);
router.get("/", theaterController.getAllTheaters);
router.get("/:id", theaterController.getTheater);

module.exports = router;
