const AppError = require("../utils/appError");
const conn = require("../services/db");
const OpenAIApi = require("openai");

// Initialize OpenAI with the API key from your environment variables
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

exports.getAllAnimalNames = (req, res, next) => {
  conn.query("SELECT * FROM animalnames", function (err, data, fields) {
    if(err) return next(new AppError(err))
    res.status(200).json({
      status: "success",
      length: data?.length,
      data: data,
    });
  });
};
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
  exports.createAnimal = async (req, res, next) => {
    if (!req.body) return next(new AppError("No form data found", 404));

    // Save user input to animals table
    const query = `INSERT INTO animals (name, status) VALUES('${req.body.name}', 'pending')`;

    conn.query(query, async function (err, data, fields) {
        if (err) {
            console.error(err);
            return next(new AppError(err, 500));
        }

        // Call OpenAI API after saving user input
        //console.log(Object.keys(openai));

        try {
          const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `Suggest one name for an animal that is a superhero.

            Animal: Cat
            Name: Captain Sharpclaw
            Animal: Cat
            Name: Agent Fluffball 
            Animal: Cat
            Name: The Incredible Feline
            Animal: Dog
            Names: Ruff the Protector
            Animal: Dog
            Name: Wonder Canine
            Animal: Dog
            Name: Sir Barks-a-Lot
            Animal: ${req.body.name}
            Name:`,
            temperature: .7,
        });
        
        //console.log("OpenAI API response:", completion);
        
        const openaiResponse = completion.choices[0].text.trim();

            // Save OpenAI response to the animalnames table
            const openAIQuery = "INSERT INTO animalnames (AnimalType, AnimalName, DateCreated) VALUES (?, ?, ?)";
            await conn.query(openAIQuery, [req.body.name, openaiResponse, new Date()]);

            res.status(201).json({
                status: "success",
                message: "Animal created!",
                description: openaiResponse
            });
        } catch (error) {
            console.error("Detailed error:", error);
            next(new AppError("OpenAI API Error", 500));
        }
    });
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
   exports.deleteAnimalName = (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError("No Animal Name id found", 404));
    }
    conn.query(
      "DELETE FROM animalnames WHERE id=?",
      [req.params.id],
      function (err, fields) {
        if (err) return next(new AppError(err, 500));
        res.status(201).json({
          status: "success",
          message: "Animal Name deleted!",
        });
      }
    );
  };
