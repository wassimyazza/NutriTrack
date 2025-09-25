import express from 'express';
import dotenv from 'dotenv';
import router from './routes/web.js';
import path from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';

const app = express();
dotenv.config({path: '.env'});
// set ejs as the template engine
app.set('view engine', 'ejs');

// make ejs now where is the /views folder
// recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(bodyParser.json());
// for serving static files
app.use(express.static('public'));

// routes
app.use('/', router);

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
