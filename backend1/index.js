import express from "express";
import {v7 as uuidv7} from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/classify/", async (req, res)=>{
  const name = req.query.name;
  try{
    if(!name) {
     return res.status(400).json({
        "status": "error",
        "message": "400 Bad request: missing or empty name"
      });
    }
    
    if(!isNaN(name)) {
      return res.status(422).json({
        "status": "error", 
        "message": "422 Unprocessable Entity: name is not a string"
      });
    }
    
    const genderizeResponse = await fetch(`https://api.genderize.io?name=${name}`);
    const agifyResponse = await fetch(`https://api.agify.io?name=${name}`);
    const nationalizeResponse = await fetch(`https://api.nationalize.io?name=${name}`);
    
    
    const genderizeData = await genderizeResponse.json();
    const agifyData = await agifyResponse.json();
    const nationalizeData = await nationalizeResponse.json();
    
    if (!genderizeResponse.ok) {
      return res.status(genderizeResponse.status).json({
        status: "error",
        message: `${genderizeResponse.status} Upstream error or server failure`
      });
    }
    
    if (!agifyResponse.ok) {
      return res.status(agifyResponse.status).json({
        status: "error",
        message: `${agifyResponse.status} Upstream error or server failure`
      });
    }
    
    if (!nationalizeResponse.ok) {
      return res.status(nationalizeResponse.status).json({
        status: "error",
        message: `${nationalizeResponse.status} Upstream error or server failure`
      });
    }
    const age =agifyData.age;
    const resultData = {
      "status": "success",
      "data": {
        "id": uuidv7(),
        "name": name,
        "gender": genderizeData.gender,
        "gender_probability": genderizeData.probability,
        "sample_size": genderizeData.count,
        "age": age,
        "age_group": age <= 12 ? "child" : age <= 19 ? "teenager" : age <= 59 ? "adult" : "senior",
        "nationality": nationalizeData.country.reduce((a,b)=>{
          return a.probability > b.probability ? a : b;
        }).country_id
      }
      
      
    };
    console.log(resultData)
    return res.json(resultData);
  }catch(error) {
    return res.status(500).json({
      "status": "error",
      "message": error.message
    });
  }
});

app.listen(PORT, ()=>{
  console.log(`Server is running at http://localhost:${PORT}`)
})


