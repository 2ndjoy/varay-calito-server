const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xloqa3g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// function sendBookingEmail(newData) {
//   const { userEmail, carName, serviceCharge } = newData;

//   const auth = {
//     auth: {
//       api_key: process.env.EMAIL_API_KEY,
//       domain: process.env.EMAIL_SEND_DOMAIN,
//     },
//   };

//   const transporter = nodemailer.createTransport(mg(auth));

//   transporter.sendMail(
//     {
//       from: "baker0003locked@gmail.com", // verified sender email
//       to: userEmail, // recipient email
//       subject: `Your rent for ${carName} , service charge is $ ${serviceCharge} only is confirmed`, // Subject line
//       text: "Hello hello ", // plain text body
//       html: `

//   <h3> Your booking is confirmed</h3>
//   <div>

//   <p>Your ${carName} will be on door</p>
//   <p>Thanks from Varay Calito</p>
//   </div>

//   `, // html body
//     },
//     function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info);
//       }
//     }
//   );
// }

async function run() {
  try {
    // collections
    const categoriesCollection = client
      .db("varayCalito")
      .collection("categories");

    const serviceCollection = client.db("varayCalito").collection("services");

    const bookingCollection = client.db("varayCalito").collection("bookings");
    const userCollections = client.db("varayCalito").collection("users");

    const paymentsCollection = client.db("varayCalito").collection("payments");

    // category
    app.get("/category", async (req, res) => {
      const query = {};
      const result = await categoriesCollection.find(query).toArray();
      res.send(result);
    });
    // service
    app.get("/services", async (req, res) => {
      const query = {};
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/services/:catId", async (req, res) => {
      const catId = req.params.catId;
      const query = { catId };
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const rent = req.body;
      const result = await bookingCollection.insertOne(rent);
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      const userEmail = req.query.userEmail;
      const query = { userEmail: userEmail };
      const booking = await bookingCollection.find(query).toArray();
      res.send(booking);
      // console.log(booking);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/payments", async (req, res) => {
      const newData = req.body;
      const result = await paymentsCollection.insertOne(newData);
      console.log(newData);
      // sendBookingEmail(newData);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollections.insertOne(user);
      res.send(result);
    });

    // users
  } finally {
  }
}

run().catch((error) => console.log(error));

app.get("/", async (req, res) => {
  console.log(uri);
  res.send("server is running");
});

app.listen(port, () => console.log("server is running on", port));
