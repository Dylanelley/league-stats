const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const testRouter = require('./routes/test.routes');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

app.use('/test', testRouter)

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});