// validators/movieValidate.js
const { body, validationResult } = require("express-validator");

const movieRules = () => [
  body("title")
  .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage("Title must be a string")
    .isLength({ min: 1, max: 30 }).withMessage("Title must be 1–30 characters"),

  body("producer")
  .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage("Producer must be a string")
    .isAlpha("en-US", { ignore: " " }).withMessage("Producer must contain only letters and spaces")
    .isLength({ max: 30 }).withMessage("Producer must be less than 30 characters"),

  body("director")
  .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage("Director must be a string")
    .isAlpha("en-US", { ignore: " " }).withMessage("Director must contain only letters and spaces")
    .isLength({ max: 30 }).withMessage("Director must be less than 30 characters"),

  body("lengthMs")
  .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 }).withMessage("Length must be a whole number in milliseconds")
    .toInt(),

  body("genre")
  .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage("Genre must be a string")
    .isAlpha("en-US", { ignore: " " }).withMessage("Genre must contain only letters and spaces")
    .isLength({ max: 15 }).withMessage("Genre must be less than 15 characters"),

  body("releaseDate")
  .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage("Release date must be a valid date string")
    .toDate()
];


const checkMovieData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { movieRules, checkMovieData };
