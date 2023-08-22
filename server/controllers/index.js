const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllAnimals = (req, res, next) => {
    conn.query("SELECT * FROM animals", function (err, data, fields) {
      if(err) return next(new AppError(err))
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    });
   };
   exports.createAnimal = (req, res, next) => {
    if (!req.body) return next(new AppError("No form data found", 404));
    const values = [req.body.name, "pending"];
    conn.query(
      "INSERT INTO animals (name, status) VALUES(?)",
      [values],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Animal created!",
        });
      }
    );
   };
   exports.getAnimal = (req, res, next) => {
    
    if (!req.params.id) {
    
      return next(new AppError("No Animal id found", 404));
    }
    conn.query(
      "SELECT * FROM animals WHERE id = ?",
      [req.params.id],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(200).json({
          status: "success",
          length: data?.length,
          data: data,
        });
      }
    );
   };
   exports.updateAnimal = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No Animal id found", 404));
    }
    conn.query(
      "UPDATE animals SET status='completed' WHERE id=?",
      [req.params.id],
      function (err, data, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Animal updated!",
        });
      }
    );
   };
   exports.deleteAllAnimals = (req, res, next) => {
    conn.query("DELETE FROM animals", function (err, fields) {
      if (err) return next(new AppError(err, 500));
      res.status(201).json({
        status: "success",
        message: "All animals deleted!",
      });
    });
  };
   exports.deleteAnimal = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No Animal id found", 404));
    }
    conn.query(
      "DELETE FROM animals WHERE id=?",
      [req.params.id],
      function (err, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Animal deleted!",
        });
      }
    );
   }

