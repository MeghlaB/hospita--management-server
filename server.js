const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000

app.use(cors([

]))

app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u2fu7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     await client.connect();
    const usersCollection = client.db("Hospital").collection("users");
    const doctorCollection = client.db("Hospital").collection("doctor");


    // users post collection api
    app.post('/users', async(req,res)=>{
        const userData = req.body;
        // insert user email if doesn't exits
        const query = {email:userData.email}
        const exitingUser = await usersCollection.findOne(query)
        if(exitingUser){
          return res.send({message:'user already exits',instertedId:null})
        }
        const result = await usersCollection.insertOne(userData)
        // console.log(result)
        res.send(result)
    })

    // user get collection api
    app.get('/users',async(req,res)=>{
      const result = await usersCollection.find().toArray()
      console.log(result)
      res.send(result)
    })



    // add-doctor collection api
app.post('/add-doctor' , async(req,res)=>{
  const doctorData = req.body
  const result = await doctorCollection.insertOne(doctorData)
  console.log(result)
  res.send(result)

})

// add-doctor collection get api
app.get('/add-doctor',async(req,res)=>{
  const result = await doctorCollection.find().toArray()
  console.log(result)
  res.send(result)
})






   









    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Loading..........')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})