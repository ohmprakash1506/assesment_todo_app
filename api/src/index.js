const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const router = require('./router/index')
const { mongoose  } = require('mongoose')
const port = process.env.PORT
const mongodbURL = process.env.MONGO_DB_URL;
const mongodbName = process.env.MONGO_DB_NAME;
const databaseUrl = `${mongodbURL}/${mongodbName}`;

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.listen(port, () => {
    console.log(`Server running and listening to port : ${port}`);  
})

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log(`Mongo db connection successfull at host : ${databaseUrl} `);
  })
  .catch((error) => {
    console.log(`db connection failed, somthing went wrong: ${error}`);
  });

const db = mongoose.connection;

db.on("disconnected", () => {
  console.log(`database disconnected from mongo db`);
});

app.use('/api/v1', router)