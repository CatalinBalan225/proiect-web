import express from "express";
import env from 'dotenv';
import cors from "cors";
import db_init from "./entities/db.init";
import masterRouter from "./routes/masterRoute";
import UserRouter from "./routes/userRouter";

env.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,PATCH,POST,DELETE'
};

app.use(cors(corsOptions));

db_init();

app.use("/api",masterRouter);
app.use("/api", UserRouter);


const port = process.env.PORT || 8005;
app.listen(port);
console.log('API is running at ' + port);