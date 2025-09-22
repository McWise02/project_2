const express = require("express")
const movieController = require("../controllers/movieController")
const router = new express.Router() 
const movieValidate = require("../utils/movie-validation");


router.post('/create',
    movieValidate.movieRules(),
    movieValidate.checkMovieData,
    movieController.createMovie
);      
router.put('/update/:id', movieController.updateMovie);  
router.delete('/delete/:id', movieController.deleteMovie); 
router.get('/', movieController.getAllMovies);      
router.get('/:id', movieController.getMovie);             


module.exports = router;