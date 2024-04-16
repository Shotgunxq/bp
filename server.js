const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/test/api", async (req, res) => {
  try {
    const { easy, medium, hard } = req.query;
    const result = await db.query(`
      SELECT * FROM easy_exercises ORDER BY RANDOM() LIMIT ${easy};
      SELECT * FROM medium_exercises ORDER BY RANDOM() LIMIT ${medium};
      SELECT * FROM hard_exercises ORDER BY RANDOM() LIMIT ${hard};
    `);

    // Combine the results from different difficulty levels
    const responseData = {
      easy: result[0].rows,
      medium: result[1].rows,
      hard: result[2].rows,
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
