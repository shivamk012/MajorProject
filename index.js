import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectToMongoDB , {updateDB , getLocation} from './services.js';
// import cors from 'cors';

dotenv.config();
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.post('/api/updatePollutionData', (req, res) => {
    const { body } = req;
    console.log(body);
    updateDB(body).then(ID =>{
        res.send(ID);
    });
});

app.get('/api/getPollutionData' , (req,res)=>{
    const {query} = req;
    getLocation(query).then(data=>{
        res.send(data);
    });
});

app.get('/' , (req,res)=>{
    res.send("Success in home");
});

connectToMongoDB();
app.listen(port, () => {
    console.log(`server started`);
});
