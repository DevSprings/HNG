import {v7 as uuidv7} from "uuid";
import pool from "../database/db.js";

export async function createUser(req, res) {
        const {name} = req.body;
        try {
            if (!name) {
                return res.status(400).json({
                    "status": "error",
                    "message": "400 Bad request: missing or empty name"
                });
            }

            if (!isNaN(name)) {
                return res.status(422).json({
                    "status": "error",
                    "message": "422 Unprocessable Entity: name is not a string"
                });
            }

            const nameQuery = `SELECT * FROM users WHERE name = $1`;
            const existingProfile = await pool.query(nameQuery, [name]);

            if(existingProfile.rows.length > 0) {                
               return res.json({
                "status": "success",
                "message": "Profile already exists",
                "data": existingProfile.rows[0]
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

            if(!genderizeData.gender || !agifyData.age || nationalizeData == "no country data") {
                return res.status(502).json({
                    "status": "error",
                    "message": "Exernal api returned an invalid response"
                })
            }
            const age = agifyData.age;
            const data = {
                "id": uuidv7(),
                "name": name,
                "gender": genderizeData.gender,
                "gender_probability": genderizeData.probability,
                "sample_size": genderizeData.count,
                "age": age,
                "age_group": age <= 12 ? "child" : age <= 19 ? "teenager" : age <= 59 ? "adult" : "senior",
                "country_id": nationalizeData.country.reduce((a, b) => {
                    return a.probability > b.probability ? a : b;
                }).country_id,
                "country_probability": nationalizeData.country.reduce((a, b) => {
                    return a.probability > b.probability ? a : b;
                }).probability,
                "created_at": new Date().toISOString()
            };

            const insertText = `INSERT INTO users (id, name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
            const values = [data.id, data.name, data.gender, data.gender_probability, data.sample_size, data.age, data.age_group, data.country_id, data.country_probability, data.created_at];

            await pool.query(insertText, values);

            return res.json({
                "status": "success",
                data
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": error.message
            });
        }
}

export async function name(params) {
    
}