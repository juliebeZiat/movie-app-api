import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import movieRouter from './movie/movie.routes';
import authRouter from './auth/auth.routes';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES 
app.use('/movie', movieRouter);
app.use('/auth', authRouter);

// CORS
const options: cors.CorsOptions = {
    optionsSuccessStatus: 200
};
app.use(cors(options));
app.use(express.json());


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


export const database = new sqlite3.Database('./my.db');