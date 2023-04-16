import { MongoClient } from 'mongodb';
import { processLocation , processPollutionData } from './processString.js';
import fs from 'fs';

let dbClient = "";

function writeFile(payload){
    fs.writeFile('./currentLocationData.json', JSON.stringify(payload), (err)=>{
        if( err ) {
            throw err;
        }else{
            console.log("file updated");
        }
    });
}

export default async function connectToMongoDB (){
    const uri = process.env.MONGO_URL;
    dbClient = new MongoClient(uri);

    try{
        await dbClient.connect();
        console.log("success");
    }catch(err){
        console.log(err);
    }
}

export async function updateDB (payload) {
    try{
        // console.log(payload.latitude);
        const {latitude , aqi} = payload;
        let processedPollutionData = processPollutionData(aqi);
        let processedLocation = processLocation(latitude);
        let findLocation = await dbClient.db("Locations").collection("Location").findOne({location : processedLocation});
        // console.log(processedLocation);
        // console.log(processedPollutionData);
        // console.log(typeof(processedLocation));
        // console.log(typeof(processedPollutionData));
        let currentData = [];
        currentData.push(processedPollutionData);
        let insertData = {
            location : processedLocation,
            pollutionData : currentData
        }
        writeFile(insertData);
        if(findLocation === null){
            try{
                let ID = await dbClient.db("Locations").collection("Location").insertOne(insertData);
                console.log(ID);
                return ID;
            }catch(err){
                console.log(err);
            }
        }else{
            console.log(findLocation);    
            currentData = findLocation.pollutionData;
            currentData.push(processedPollutionData);
            let updated = await dbClient.db("Locations").collection("Location").updateOne({location : processedLocation},{$set : {"pollutionData" : currentData}});
            return updated;
        } 
    }catch(err){
        console.log(err);
    }
}

export async function getLocation(payload){
    try{
        const data = await dbClient.db("Locations").collection("Location").findOne({
            location : payload.latitude
        })
        return data;
    }catch(err){
        console.log(err);
    }
}

export async function getData(){
    try{
        const data = await dbClient.db("Locations").collection("Location").find().toArray();
        console.log(data[0].pollutionData);
        return data;
    }catch(err){
        console.log(err);
    }
}