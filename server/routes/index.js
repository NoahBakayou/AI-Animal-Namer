const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router
 .route("/")
 .get(controllers.getAllAnimals)
 .post(controllers.createAnimal)
 .delete(controllers.deleteAllAnimals);

router
 .route("/animalnames")
 .get(controllers.getAllAnimalNames);

router
 .route("/:id")
 .get(controllers.getAnimal)
 //.put(controllers.updateAnimal)
 .delete(controllers.deleteAnimal);

 router
 .route("/animalnames/:id")
 .delete(controllers.deleteAnimalName);
 

module.exports = router;