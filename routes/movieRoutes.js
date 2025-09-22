const express = require("express")
const movieController = require("../controllers/movieController")
const router = new express.Router() 
const { createMovieValidator } = require("./validators/movieValidator");
const utilities = require("../utilities/")  


router.post('/create',
    movieValidate.movieRules(),
    movieValidate.checkMovieData,
    utilitiesmoviesController.createMovie
);      
router.put('/update/:id', movieController.updateMovie);  
router.delete('/delete/:id', movieController.deleteMovie); 
router.get('/', movieController.getAllMovies);      
router.get('/:id', movieController.getMovie);             


module.exports = router;