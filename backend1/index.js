import express, { json } from "express";
import dotenv from "dotenv";
import { createUser, getUser } from "./controllers/user.controller.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());

app.post("/api/profiles/", createUser);
app.get("/api/profiles/", getUser);

app.listen(PORT, ()=>{
  console.log(`Server is running at http://localhost:${PORT}`)
})


