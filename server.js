const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config(); // load .env into process.env
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const mongodb = require('./database/connect');

const movieRoutes = require('./routes/movieRoutes');


app.use(express.json());
app.use((req, _res, next) => {
  console.log('REQ', req.method, req.originalUrl);
  next();
});
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use('/movies', movieRoutes)
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



  
const port = process.env.PORT || 3000;  // fallback for local dev
const host = process.env.HOST || "localhost"; 

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});