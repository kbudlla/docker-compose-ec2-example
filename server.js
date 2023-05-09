// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/

const db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
      {method: 'GET', path: '/api/profile', description: 'Data about me'},
      {method: 'GET', path: '/api/books/', description: 'Get all books information'},
      {method: 'POST', path: '/api/books/', description: 'Adds a new book'},
      {method: 'PUT', path: '/api/books/:id', description: 'Updates an existing book data'},
      {method: 'DELETE', path: '/api/books/:id', description: 'Deletes an existing book'}, 
    ]
  })
});
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'Klajdi and Elvis',
    'homeCountry': 'Albania',
    'degreeProgram': 'Masters in Management and Technology',
    'email': 'ge62rup@mytum.de',
    'deployedURLLink': '',
    'apiDocumentationURL': '',
    'currentCity': 'Munich',
    'hobbies': ['Soccer', 'Snowboarding', 'Cars', 'Books']

  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', async (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);
  let newDocument = req.body;
  const newBook = await db.books.collection.insertOne(newDocument);
  res.json(newBook);
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', async (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData.author}`);

  const filter = { _id: bookId};

  const doc = await db.books.findOne(filter);

  await db.books.updateOne(filter, bookNewData);

  await doc.save();

  const updatedBookInfo = await db.books.findOne(filter);

  res.json(updatedBookInfo);
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', async(req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;

  const filter = { _id: bookId };
  
  var deletedBook = await db.books.deleteOne(filter)
  res.json(deletedBook);
});


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
