const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

//Must remove "/" from your production URL
// midleWare
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hospital-managment-d7e21.web.app",
    ],
    // methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
  })
);

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { Rewind, ArrowUpSquare } = require("lucide-react");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u2fu7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db("Hospital").collection("users");
    const doctorCollection = client.db("Hospital").collection("doctors");
    const appoinmentsCollection = client
      .db("Hospital")
      .collection("appoinments");

    // jwt api created

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      console.log(token);
      res.send({ token });
    });

    // middlewars
    const verifyToken = (req, res, next) => {
      console.log("Inside verify token", req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized  access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
      // next()
    };

// use verify admin  after verifyToken 
const verifyAdmin = async(req,res,next)=>{
  const email = req.decoded.email
  const query = {email:email}
  const user = await usersCollection.findOne(query)
  const isAdmin = user?.role === 'admin'
  if(!isAdmin){
    return res.status(401).send({ message: "forbidden access" });
  }
  next()
}









    // users post collection api
    app.post("/users", async (req, res) => {
      const userData = req.body;
      // insert user email if doesn't exits
      const query = { email: userData.email };
      const exitingUser = await usersCollection.findOne(query);
      if (exitingUser) {
        return res.send({ message: "user already exits", instertedId: null });
      }
      const result = await usersCollection.insertOne(userData);
      // console.log(result)
      res.send(result);
    });

    // user get collection api
    app.get("/users", verifyToken,verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

// verify admin cheack 
app.get('/users/admin/:email',verifyToken,async(req,res)=>{
  const email = req.params.email
  console.log(email)
  if (email !== req.decoded.email){
    return res.status(403).send({ message: "unauthorized access" });
  }
  const query = {email:email}
  const user = await usersCollection.findOne(query)
  let admin = false
  if(user){
    admin = user?.role ==='admin'
  }
  res.send({admin})
})





    // add-doctor collection api
    app.post("/add-doctor", async (req, res) => {
      const doctorData = req.body;
      const result = await doctorCollection.insertOne(doctorData);
      // console.log(result)
      res.send(result);
    });

    // add-doctor collection get api
    app.get("/doctors", async (req, res) => {
      const result = await doctorCollection.find().toArray();
      // console.log(result)
      res.send(result);
    });

    // doctor details
    app.get("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const qeury = { _id: new ObjectId(id) };
      const result = await doctorCollection.find(qeury).toArray();
      // console.log(result)
      res.send(result);
    });

    // Booking appoinments
    app.post("/appoinments", async (req, res) => {
      const appoinmentData = req.body;
      const result = await appoinmentsCollection.insertOne(appoinmentData);
      // console.log(result)
      res.send(result);
    });

    // booking appoinmets all data user
    app.get("/appoinments", async (req, res) => {
      const result = await appoinmentsCollection.find().toArray();
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Loading..........");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
