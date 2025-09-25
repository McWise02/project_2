// utils/theater-validation.js
const { body, validationResult } = require("express-validator");

/** CREATE: require fields */
const theaterCreateRules = () => [
  body("name").trim().notEmpty().withMessage("Theater name is required"),

  body("location")
    .isObject().withMessage("Location must be an object")
    .custom((value) => {
      const needed = ["address", "city", "country", "postalCode"];
      const missing = needed.filter((k) => !value?.[k] || String(value[k]).trim() === "");
      if (missing.length) {
        throw new Error(`Location missing fields: ${missing.join(", ")}`);
      }
      return true;
    }),

  body("numberOfScreens").isInt({ min: 1 }).withMessage("numberOfScreens must be an integer ≥ 1"),
  body("seatingCapacity").isInt({ min: 1 }).withMessage("seatingCapacity must be an integer ≥ 1"),
  body("contactNumber").trim().notEmpty().withMessage("contactNumber is required"),

  body("amenities")
    .isArray().withMessage("amenities must be an array"),

  body("ticketPrices")
    .isObject().withMessage("ticketPrices must be an object")
    .custom((v) => {
      if (typeof v.adult !== "number" || typeof v.child !== "number" || typeof v.senior !== "number") {
        throw new Error("ticketPrices must include numeric adult, child, and senior");
      }
      return true;
    }),

  body("openingHours").isObject().withMessage("openingHours must be an object"),
];

/** UPDATE: everything optional, but validated if present */
const theaterUpdateRules = () => [
  body("name").optional().isString().withMessage("name must be a string"),

  body("location")
    .optional()
    .isObject().withMessage("location must be an object")
    .custom((value) => {
      // allow partial location on update; if fields are present, they must be non-empty strings
      const keys = ["address", "city", "country", "postalCode"];
      for (const k of keys) {
        if (k in value && (value[k] == null || String(value[k]).trim() === "")) {
          throw new Error(`location.${k} cannot be empty when provided`);
        }
      }
      return true;
    }),

  body("numberOfScreens")
    .optional()
    .isInt({ min: 1 })
    .withMessage("numberOfScreens must be an integer ≥ 1"),

  body("seatingCapacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("seatingCapacity must be an integer ≥ 1"),

  body("contactNumber")
    .optional()
    .isString()
    .bail()
    .notEmpty()
    .withMessage("contactNumber cannot be empty when provided"),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("amenities must be an array"),

  body("ticketPrices")
    .optional()
    .isObject()
    .withMessage("ticketPrices must be an object")
    .custom((v) => {
      // allow partial ticketPrices; if a field is present, it must be a number
      const keys = ["adult", "child", "senior"];
      for (const k of keys) {
        if (k in v && typeof v[k] !== "number") {
          throw new Error(`ticketPrices.${k} must be a number when provided`);
        }
      }
      return true;
    }),

  body("openingHours")
    .optional()
    .isObject()
    .withMessage("openingHours must be an object"),
];

/** Common validator runner */
const checkTheaterData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  theaterCreateRules,
  theaterUpdateRules,
  checkTheaterData,
};
