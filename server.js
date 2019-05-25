const path = require('path');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(express.json());
const axios = require('axios');
const querystring = require('querystring');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//then research mongo update multiple
//to do: make it an update instead of just a write
//make them use their id as _id
//art collection2 currently has correct number of data

//lsof -PiTCP -sTCP:LISTEN
//sudo kill -15 32458



/// YOUR ROUTES GO HERE!


        



/////////////////////////////////////////////

// Totally insecure backend routes below, good only for rapid prototyping
// unsecured front-end applications. Should not be used in production.


// GET for getting existing item
app.get('/api/mongodb/:collectionName/', (request, response) => {
  const collectionName = request.params.collectionName;

  // Get GET params, if there are any
  const query = request.query || {};

  // Due to a requirement of MongoDB, whenever we query based on _id field, we
  // have to do it like this using ObjectId
  if (query._id) {
    query._id = ObjectId(query._id);
  }

  db.collection(collectionName)
    .find(query)
    .toArray((err, results) => {
      // Got data back.. send to client
      if (err) throw err;
      response.json(results);
    });
});

// POST for creating a new item
app.post('/api/mongodb/:collectionName/', (request, response) => {
  const collectionName = request.params.collectionName;
  const data = request.body;
  db.collection(collectionName)
    .insert(data, (err, results) => {
      // Got data back.. send to client
      if (err) throw err;

      response.json({
        'success': true,
        'results': results,
      });
    });
});


// PUT endpoint for modifying an existing item
app.put('/api/mongodb/:collectionName/', (request, response) => {
  const collectionName = request.params.collectionName;
  const data = request.body;
  //console.log("data:", data);
  const query = request.query;
 // console.log("query:", query);
  //console.log("data.item.properties.id:", data.item.properties.id);

  // Due to a requirement of MongoDB, whenever we query based on _id field, we
  // have to do it like this using ObjectId
  

      db.collection(collectionName)
        .update({"properties.id": {$eq: data.item.properties.id}}, {$set: data.item}, {upsert: true}, (err, results) => {
          if (err) throw err;

          // If we modified exactly 1, then success, otherwise failure
          if (results.result.nModified === 1) {
            response.json({
              success: true,
            });
          } else {
            response.json({
              success: false,
            });
          }
        });
});


// D in CRUD, delete a single item with given criteria
app.delete('/api/mongodb/:collectionName/', (request, response) => {
  const collectionName = request.params.collectionName;
  const query = request.query;

  // Due to a requirement of MongoDB, whenever we query based on _id field, we
  // have to do it like this using ObjectId
  if (query._id) {
    query._id = ObjectId(query._id);
  }

  db.collection(collectionName)
    .deleteOne(query, (err, results) => {
      if (err) throw err;

      // If we deleted exactly 1, then success, otherwise failure
      if (results.result.n === 1) {
        response.json({
          success: true,
        });
      } else {
        response.json({
          success: false,
        });
      }
    })
});







/////////////////////////////////////////////
// Boilerplate, no need to touch what's below

/////////////////////////////////////////////
// Logger & configuration
function logger(req, res, next) {
  console.log(req.method, req.url);
  next();
}
app.use(logger);
/////////////////////////////////////////////


// For production, handle any requests that don't match the ones above
app.use(express.static(path.join(__dirname, 'client/build')));

// Wild-card, so handle everything else
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

//

 
 
 // Set up configuration variables
if (!process.env.MONGODB_URI) {
  console.log('- Error - Must specify the following env variables:');
  console.log("MONGODB_URI='mongodb://someUser:somePW@site.com:1234/someDB'");
  console.log('- (See README.md)');
  process.exit(1);
}
const MONGODB_URL = process.env.MONGODB_URI;
const splitUrl = MONGODB_URL.split('/');
const mongoDbDatabaseName = splitUrl[splitUrl.length - 1];

let db;
// First connect to MongoDB, then start HTTP server
MongoClient.connect(MONGODB_URL, {useNewUrlParser: true}, (err, client) => {
  if (err) throw err;
  console.log("--MongoDB connection successful");
  db = client.db(mongoDbDatabaseName);

  // Start the server
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`
      *********************************************
      * Insecure prototyping backend is running!  *
      * Only use for prototyping                  *
      * Backend server up at ${PORT}              *
      *********************************************
    `);
  })
  
  
  let reformattedArtCollection= []
        axios.get('https://data.sfgov.org/resource/7rjr-9n9w.json')
            .then(function (response) {
            
            console.log("response received")
        for (let artpiece of response.data){
            let reformattedArtPiece= {
              "type": "Feature",
              "properties": {
                    "id": artpiece.accession_number,
                    "title": artpiece.display_title,
                    "artist": artpiece.artist,
                    "date": artpiece.creation_date,
                    "medium": artpiece.media_support,
                    "size": artpiece.display_dimensions,
                    "location": artpiece.facility+ ", " +  artpiece.location_description,
                    "address": artpiece.street_address,
                    "updated": "awesome"
                    },
              "geometry": {
                "type": "Point",
                "coordinates": [
                   (artpiece.point ? artpiece.point.latitude: null),
                   (artpiece.point ? artpiece.point.longitude: null)

                ]
              }
            }
            reformattedArtCollection.push(reformattedArtPiece)
        }
            
            console.log("refomatted art collection created" );
            
            
              let data= reformattedArtCollection
              for (let item of data){
                     axios.put('http://localhost:8080/api/mongodb/ArtCollectionServer/', 
                {item}//
                  )
                  .then(function (response) {
                  //if (response.data.success = true){
                  // console.log("reposne:", response.data);
                  // }
                  })
                  .catch(function (error) {
                    console.log("axios error:", error);
                  });
              
              };//
            
        }).catch(function (error) {
            console.log('break');
            console.log(error);
        });
  
  
  


  
});
