import express, { json } from "express";
import dotenv from "dotenv";
import { createUser } from "./controllers/user.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.post("/api/profiles/", createUser);

app.listen(PORT, ()=>{
  console.log(`Server is running at http://localhost:${PORT}`)
})


