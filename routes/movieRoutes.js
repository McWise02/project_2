const express = require("express")
const movieController = require("../controllers/movieController")
const router = new express.Router() 
const movieValidate = require("../utils/movie-validation");
const { requireAuth } = require("../utils/auth");

router.post('/create',
    requireAuth({ loginRedirect: "/auth/github" }),
    movieValidate.movieRules(),
    movieValidate.checkMovieData,
    movieController.createMovie
);      
router.put('/update/:id', requireAuth({ loginRedirect: "/auth/github" }), movieValidate.movieRules(), movieValidate.checkMovieData, movieController.updateMovie);  
router.delete('/delete/:id', movieController.deleteMovie); 
router.get('/', movieController.getAllMovies);      
router.get('/:id', movieController.getMovie);             


module.exports = router;