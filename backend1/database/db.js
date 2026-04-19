import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const {Pool} =pg;
const pool = new Pool({
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
host: process.env.DB_HOST,
port: process.env.DB_PORT,
database: process.env.DB_NAME
});

pool.on("connect", ()=> {
    console.log("connected to DB")
})

pool.on("error", (error)=> {
    console.log(error);
    process.exit(-1);
})

export default pool;