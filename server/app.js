const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth-api');
const mainRoute = require('./routes/main-api');
const config = require('./lib/config');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3111',
  credentials: true
}));

app.use('/auth-api', authRoute);
app.use('/main-api', mainRoute);

app.listen(config.PORT || 8000);