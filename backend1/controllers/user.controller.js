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

            if (!genderizeResponse.ok || !genderizeData.gender) {
                return res.status(502).json({
                    status: "error",
                    message: `Genderize api returned an invalid response`
                });
            }

            if (!agifyResponse.ok || !agifyData.age) {
                return res.status(502).json({
                    status: "error",
                    message: `Agify api returned an invalid response`
                });
            }

            if (!nationalizeResponse.ok || nationalizeData == "no country data") {
                return res.status(nationalizeResponse.status).json({
                    status: "error",
                    message: `Nationalize api returned an invalid response`
                });
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

export async function getUser(req, res) {
    const id = req.params.id;
    try {
        if (!id) {
                return res.status(400).json({
                    "status": "error",
                    "message": "400 Bad request: missing or empty id"
                });
            }

            if (!isNaN(id)) {
                return res.status(422).json({
                    "status": "error",
                    "message": "422 Unprocessable Entity: id is not a string"
                });
            }

            const queryText = `SELECT * FROM users WHERE id = $1`;
            const data = await pool.query(queryText, [id]);

            if(data.rows.length === 0) {
                return res.status(404).json({
                    "status": "error",
                    "message": "404 Not Found: Profile not found"
                })
            }

            return res.json({
                "status": "success",
                "data": data.rows[0]
            })
    } catch (error) {
        return res.status(500).json({
                "status": "error",
                "message": error.message
            });
    }
}

export async function getUsers(req, res) {
    const {gender, country_id, age_group} = req.query;
    try {
        let queryText = "SELECT * FROM users";
        const queryParams = [];
        const queryConditions = [];

        if(gender) {
            queryParams.push(gender);
            queryConditions.push(`gender = $${queryParams.length}`)
        }

        if(country_id) {
            queryParams.push(country_id);
            queryConditions.push(`country_id = $${queryParams.length}`)
        }

        if(age_group) {
            queryParams.push(age_group);
            queryConditions.push(`age_group = $${queryParams.length}`)
        }

        if(queryParams.length > 0) {
            queryText += " WHERE " + queryConditions.join(" AND ");
        }

        const data = await pool.query(queryText, queryParams);

        return res.status(200).json({
            "status": "success",
            "count": data.rows.length,
            "data": data.rows
        })
    } catch (error) {
        return res.status(500).json({
                "status": "error",
                "message": error.message
            });
    }
}

export async function deleteUser(req, res) {
    const id = req.query.id;
    try {
        if (!id) {
                return res.status(400).json({
                    "status": "error",
                    "message": "400 Bad request: missing or empty id"
                });
            }

            if (!isNaN(id)) {
                return res.status(422).json({
                    "status": "error",
                    "message": "422 Unprocessable Entity: id is not a string"
                });
            }

            const queryText = `DELETE FROM users WHERE id = $1 RETURNING data`;
            const data = await pool.query(queryText, [id]);

            if(data.rows.length === 0) {
                return res.status(404).json({
                    "status": "error",
                    "message": "404 Not Found: Profile not found"
                })
            }
            console.log(`User with name ${data.rows[0].name} is deleted!`)
            return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
                "status": "error",
                "message": error.message
            });
    }
}