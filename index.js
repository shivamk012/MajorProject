import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectToMongoDB , {updateDB , getLocation , getData} from './services.js';
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.get('/api/getPath' , async(req,res)=>{
    const at = "pk.eyJ1Ijoic2hpdmFtazAxMiIsImEiOiJjbGZtdDEybjAwZjkyM3FvM3JlZmdjOTQ5In0.DRFtEaiTP-sd468Y75z9Wg";
    // const url = `https://api.mapbox.com/directions/v5/mapbox/driving/22.714496;75.915487;22.726295388347932;75.87414856287434?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=${at}`;
    const url = "https://api.mapbox.com/directions/v5/mapbox/cycling/75.915516%2C22.714422%3B75.874145%2C22.726307?alternatives=true&geometries=geojson&access_token=pk.eyJ1Ijoic2hpdmFtazAxMiIsImEiOiJjbGZtdDEybjAwZjkyM3FvM3JlZmdjOTQ5In0.DRFtEaiTP-sd468Y75z9Wg";

    const result  = await axios.get(url);
    console.log(result.data.routes);
    res.send(result.data.routes);
    // duration : in seconds
    // distance : in
})

app.get('/api/getDoc' , (req,res) => {
    getData().then(data=>{
        let polData = [[data[0].pollutionData] , [data[1].pollutionData]];
        res.send(polData);
    })
})

app.get('/api/currentLocationData' , (req , res)=>{
    fs.readFile('currentLocationData.json', 'utf-8', function(err, data) {
        if( !err )
            res.send(data);
        else
            throw err;
    });
})

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
    console.log(`server started at ${port}`);
});
