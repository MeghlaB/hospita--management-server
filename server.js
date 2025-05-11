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

    // app.post("/jwt", async (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "365d",
    //   });
    //   // console.log(token);
    //   res.send({ token });
    // });


    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const payload = { email: user.email };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

    // middlewars
    const verifyToken = (req, res, next) => {
      // console.log("Inside verify token", req.headers.authorization);
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
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        return res.status(401).send({ message: "forbidden access" });
      }
      next();
    };

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
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      // console.log(result);
      res.send(result);
    });




       // user profile api.......................
       app.get('/users/profile/:email', async (req, res) => {
        try {
          const email = req.params.email; 
          // console.log('Email:', email);
  
          const query = { email: email }; 
          // console.log('Query:', query);
  
          const user = await usersCollection.findOne(query); 
  
          if (user) {
            res.send(user); // Send the user data
          } else {
            res.status(404).send({ message: 'User not found' });
          }
        } catch (error) {
          res.status(500).send({ message: 'Error fetching user profile', error });
        }
      });
    
      app.get('/users/profileById/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const user = await usersCollection.findOne(query);
      
          if (user) {
            res.send(user);
          } else {
            res.status(404).send({ message: 'User not found' });
          }
        } catch (error) {
          res.status(500).send({ message: 'Error fetching user profile', error });
        }
      });
      
      // app.get('/update/:id', async (req, res) => {
      //   try {
      //     const id = req.params.id; // Extract the email from the URL parameters
      //     // console.log('Email:', id);
  
      //     const query = { _id: new ObjectId(id) }; // Query to search for the user
      //     // console.log('Query:', query);
  
      //     const user = await usersCollection.findOne(query); // Find the user in the collection
  
      //     if (user) {
      //       res.send(user); // Send the user data
      //     } else {
      //       res.status(404).send({ message: 'User not found' });
      //     }
      //   } catch (error) {
      //     res.status(500).send({ message: 'Error fetching user profile', error });
      //   }
      // });
      // user update api.......................
      app.put('/users/update/:id', async (req, res) => {
        const id = req.params.id;
        const userData = req.body;
  
        try {
          const query = { _id: new ObjectId(id) };
          const updateDoc = {
            $set: {
              name: userData.name,
              status: userData.status,
              role: userData.role,
              upazila: userData.upazila,
              photo: userData.photo
            }
          };
  
          const result = await usersCollection.updateOne(query, updateDoc);
          if (result.modifiedCount > 0) {
            res.send({ success: true, message: 'Profile updated successfully!' });
          } else {
            res.send({ success: false, message: 'No changes were made.' });
          }
        } catch (error) {
          res.status(500).send({ success: false, message: 'Failed to update profile.', error: error.message });
        }
      });






    app.get("/users-Admin", verifyToken, verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray();
      // console.log(result);
      res.send(result);
    });












    // verify admin cheack
    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "unauthorized access" });
      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });







    // add-doctor collection api
    app.post("/add-doctor", async (req, res) => {
      const doctorData = req.body;
      const result = await doctorCollection.insertOne(doctorData);
      console.log(result)
      res.send(result);
    });

    // add-doctor collection get api
    app.get("/doctors", async (req, res) => {
      const result = await doctorCollection.find().toArray();
      console.log(result)
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

    // Route to get filtered doctors by specialization
    // app.get("/doctors", async (req, res) => {
    //   const { specialization } = req.query;
    //   console.log(specialization)
    //   const query = {};
    
    //   if (specialization) query.specialization= specialization;
    
    //   const result = await doctorCollection.find(query).toArray();
    //   res.send(result);
    // });
    
    // Booking appoinments
    app.post("/appoinments", async (req, res) => {
      const appoinmentData = req.body;
      const result = await appoinmentsCollection.insertOne(appoinmentData);
      console.log(result)
      res.send(result);
    });

    // booking appoinmets all data user
    app.get("/appoinments", async (req, res) => {
      const result = await appoinmentsCollection.find().toArray();
      res.send(result);
    });



 // Get appointments by user email
app.get("/appoinments/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const result = await appoinmentsCollection.find(query).toArray();
  res.send(result);
});


 // Get appointments by user id 

 app.get('/appointments/:id',async(req,res)=>{
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const user = await appoinmentsCollection.findOne(query);

    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error fetching user profile', error });
  }
 })





// Cancel an appointment by ID
app.patch("/appointments/cancel/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      status: 'canceled'
    }
  };
  const result = await appoinmentsCollection.updateOne(filter, updateDoc);
  res.send(result);
});


    app.put("/appointment/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
    
      try {
        const updatedAppointment = await appoinmentsCollection.updateOne(
          { _id: new ObjectId(id) },  
          { $set: { status } }
        );
    
        if (!updatedAppointment.modifiedCount) {
          return res.status(404).json({ message: "Appointment not found" });
        }
    
        res.json({ message: "Appointment status updated", updatedAppointment });
      } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
      }
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
