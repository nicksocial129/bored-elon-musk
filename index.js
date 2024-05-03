import express from "express";
import bodyParser from "body-parser";
import * as dotevn from "dotenv";
dotevn.config();

// Controllers
import { createPrediction } from "./controllers/flowise.js";

const app = express();
const PORT = process.env.PORT || 4000;

let ideaCount = 32; // Variable to store the count of ideas generated

app.use(express.static("public"));

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to get the current count of generated ideas
app.get("/api/getCount", (req, res) => {
    res.json({ count: ideaCount });
});

// Modified createPrediction to increment the idea count
const modifiedCreatePrediction = async (req, res) => {
    ideaCount++; // Increment the count each time this endpoint is called
    return createPrediction(req, res);
};

app.post("/api/flowise", modifiedCreatePrediction);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
