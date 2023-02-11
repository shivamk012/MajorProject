import { MongoClient } from 'mongodb';

let dbClient = "";

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
        let findLocation = await dbClient.db("Locations").collection("Location").findOne({latitude : payload.latitude});
        if(findLocation === null){
            let ID = await dbClient.db("Locations").collection("Location").insertOne(payload);
            return ID;
        }else{
            // console.log(obj);
            let updated = await dbClient.db("Locations").collection("Location").updateOne({latitude : payload.latitude},{$set : {"aqi" : payload.aqi}});
            return updated;
        } 
    }catch(err){
        console.log(err);
    }
}

export async function getLocation(payload){
    try{
        const data = await dbClient.db("Locations").collection("Location").findOne({
            latitude : payload.latitude
        })
        return data;
    }catch(err){
        console.log(err);
    }
}