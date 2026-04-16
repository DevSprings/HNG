import express from "express";
import cors from "cors";
const app = express();
const PORT =3000;
app.use(cors());
app.get("/api/classify/", async (req, res)=> {
  const name = req.query.name;
  try {
    const response = await fetch(`https://api.genderize.io?name=${name}`);
    
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "400 Bad Request: Missing or empty name parameter"
      });
    }

    if (!isNaN(name)) {
      return res.status(422).json({
        status: "error",
        message: "422 Unprocessable Entity: name is not a string"
      });
    }

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        status: "error",
        message: `${response.status} Upstream error or server failure`
      });
    }
    data.sample_size= data.count;
    data.is_confident=data.probability >= 0.7 && data.sample_size >= 100 ? true : false;
    data.processed_at = new Date().toISOString();
    delete data.count;
    res.status(200).json({
      status: "success", 
      data,
    });
  } catch(error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

app.listen(PORT, ()=> {
  console.log(`Hello, running on server http://localhost:${PORT}`)
});

export default app;