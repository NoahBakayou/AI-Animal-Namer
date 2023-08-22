const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router
 .route("/")
 .get(controllers.getAllAnimals)
 .post(controllers.createAnimal)
 .delete(controllers.deleteAllAnimals);

router
 .route("/:id")
 .get(controllers.getAnimal)
 .put(controllers.updateAnimal)
 .delete(controllers.deleteAnimal);

module.exports = router;
