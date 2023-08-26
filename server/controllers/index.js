const AppError = require("../utils/appError");
const conn = require("../services/db");
const OpenAIApi = require("openai");

// Initialize OpenAI with the API key from your environment variables
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });


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
            prompt: `Suggest a name for a breed of the animal ${req.body.name}.`,
            temperature: .3,
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

