const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.post('/tweeted', (req, res) => {
    const { body } = req;
    console.log(body.tweet);
    res.send("Success");
});

app.listen(port, () => {
    console.log(`Express api/webhook app listening at http://localhost:${port}`);
});
