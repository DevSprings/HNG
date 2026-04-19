import express, { json } from "express";
import dotenv from "dotenv";
import { createUser, deleteUser, getUser, getUsers } from "./controllers/user.controller.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!);
}
);
app.post("/api/profiles/", createUser);
app.get("/api/profiles/:id", getUser);
app.get("/api/profiles/", getUsers);
app.delete("/api/profiles/:id", deleteUser);

app.listen(PORT, ()=>{
  console.log(`Server is running at http://localhost:${PORT}`)
})


