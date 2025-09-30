// server.js
import express from 'express';
import dotenv from 'dotenv';
import router from './routes/web.js';
import path from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import methodOverride from 'method-override';

const app = express();
dotenv.config({path: '.env'});

// Session middleware
app.use(
   session({
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
      resave: false,
      saveUninitialized: false,
      cookie: {
         secure: false,
         maxAge: 24 * 60 * 60 * 1000,
      },
   })
);

// set ejs as the template engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/main');

// make ejs know where is the /views folder
// recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// for serving static files
app.use(express.static('public'));

// routes
app.use('/', router);

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
