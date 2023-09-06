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

    // Save user input to animals table securely using parameterized query
    const values = [req.body.name, 'pending'];
    const query = "INSERT INTO animals (name, status) VALUES(?, ?)";

    conn.query(query, values, async function (err, data, fields) {
        if (err) {
            console.error(err);
            return next(new AppError(err, 500));
        }
        // Call OpenAI API after saving user input

        try {
          const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `Suggest one name for an animal that is a superhero.

            Animal: Cat
            Name: Captain Sharpclaw
            Animal: Dog
            Name: Sir Barks-a-Lot
            Animal: ${req.body.name}
            Name:`,
            temperature: .3,
        });
        
        //console.log("OpenAI API response:", completion);
        console.log(completion);
        const openaiResponse = completion.choices[0].text.trim();
        console.log(openaiResponse);

        // Save OpenAI response to the animalnames table insecurely
        const openAIQuery = `INSERT INTO animalnames (AnimalType, DateCreated, AnimalName) VALUES (?, ?, '${openaiResponse}')`;
        console.log(openAIQuery);
        await conn.query(openAIQuery, [req.body.name, new Date()]);
        //await conn.query(openAIQuery);
    
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
      
      conn.query("DELETE FROM animalnames", function (err, fields) {
        if (err) return next(new AppError(err, 500));
        
        res.status(201).json({
          status: "success",
          message: "All data deleted!",
        });
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