import mysql from 'mysql2/promise.js'
import env from 'dotenv';


env.config();

function createDatabase(){
    mysql.createConnection({
        // user: process.env.DB_USERNAME,
        // password : process.env.DB_PASSWORD
        user: 'root',
        password: '',
        host: 'localhost',
        database: 'dissertation'
    })
    .then((connection)=>{
        return connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`)
    })
    .catch((err)=>{
        console.warn(err.stack)
    })
}

function fkConfig(){

}

function db_init(){
    createDatabase();
    fkConfig();
}

export default db_init;