const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/persondb';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Fail fast after 5 seconds
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Helper function to check MongoDB connection
function checkMongoConnection() {
  return mongoose.connection.readyState === 1; // 1 = connected
}

// Person Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  mobileNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Person = mongoose.model('Person', personSchema);

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// GET /person - Display table with list of people
app.get('/person', async (req, res) => {
  try {
    if (!checkMongoConnection()) {
      return res.status(503).send(`
        <html>
          <head><title>Database Connection Error</title>
          <style>
            body { font-family: Arial; padding: 40px; background: #f5f5f5; }
            .error-box { background: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #dc3545; }
            p { line-height: 1.6; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
          </style>
          </head>
          <body>
            <div class="error-box">
              <h1>⚠️ MongoDB Connection Error</h1>
              <p><strong>MongoDB is not running or not accessible.</strong></p>
              <p>Please make sure MongoDB is installed and running on your system.</p>
              <h3>To fix this:</h3>
              <ol>
                <li>Start MongoDB service:
                  <br><code>net start MongoDB</code> (Windows)
                  <br><code>sudo systemctl start mongod</code> (Linux)
                  <br><code>brew services start mongodb-community</code> (Mac)
                </li>
                <li>Or use MongoDB Atlas and set the connection string:
                  <br><code>set MONGODB_URI=mongodb://your-connection-string</code>
                </li>
                <li>Then restart this Node.js server</li>
              </ol>
              <p><a href="/person">Refresh</a> after starting MongoDB.</p>
            </div>
          </body>
        </html>
      `);
    }
    const people = await Person.find().sort({ createdAt: -1 });
    res.render('list', { people });
  } catch (error) {
    res.status(500).send('Error fetching people: ' + error.message);
  }
});

// GET /person/new - Display form to create a new person
app.get('/person/new', (req, res) => {
  res.render('create', { person: null, errors: null });
});

// POST /person - Create a new person
app.post('/person', async (req, res) => {
  try {
    if (!checkMongoConnection()) {
      return res.status(503).render('create', { 
        person: req.body, 
        errors: ['MongoDB is not connected. Please start MongoDB and try again.'] 
      });
    }
    const { name, age, gender, mobileNumber } = req.body;
    
    // Validation
    const errors = [];
    if (!name || name.trim() === '') errors.push('Name is required');
    if (!age || isNaN(age) || age < 0) errors.push('Valid age is required');
    if (!gender) errors.push('Gender is required');
    if (!mobileNumber || mobileNumber.trim() === '') errors.push('Mobile number is required');

    if (errors.length > 0) {
      return res.render('create', { person: req.body, errors });
    }

    const person = new Person({
      name: name.trim(),
      age: parseInt(age),
      gender,
      mobileNumber: mobileNumber.trim()
    });

    await person.save();
    res.redirect('/person');
  } catch (error) {
    res.status(500).render('create', { 
      person: req.body, 
      errors: ['Error creating person: ' + error.message] 
    });
  }
});

// GET /person/:id/edit - Display form to edit a person
app.get('/person/:id/edit', async (req, res) => {
  try {
    if (!checkMongoConnection()) {
      return res.status(503).send('MongoDB is not connected. Please start MongoDB and try again.');
    }
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).send('Person not found');
    }
    res.render('edit', { person, errors: null });
  } catch (error) {
    res.status(500).send('Error fetching person: ' + error.message);
  }
});

// PUT /person/:id - Update a person
app.put('/person/:id', async (req, res) => {
  try {
    if (!checkMongoConnection()) {
      return res.status(503).send('MongoDB is not connected. Please start MongoDB and try again.');
    }
    const { name, age, gender, mobileNumber } = req.body;
    
    // Validation
    const errors = [];
    if (!name || name.trim() === '') errors.push('Name is required');
    if (!age || isNaN(age) || age < 0) errors.push('Valid age is required');
    if (!gender) errors.push('Gender is required');
    if (!mobileNumber || mobileNumber.trim() === '') errors.push('Mobile number is required');

    if (errors.length > 0) {
      const person = await Person.findById(req.params.id);
      return res.render('edit', { person: { ...person.toObject(), ...req.body }, errors });
    }

    const person = await Person.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        age: parseInt(age),
        gender,
        mobileNumber: mobileNumber.trim()
      },
      { new: true, runValidators: true }
    );

    if (!person) {
      return res.status(404).send('Person not found');
    }

    res.redirect('/person');
  } catch (error) {
    res.status(500).send('Error updating person: ' + error.message);
  }
});

// GET /person/:id/delete - Display delete confirmation page
app.get('/person/:id/delete', async (req, res) => {
  try {
    if (!checkMongoConnection()) {
      return res.status(503).send('MongoDB is not connected. Please start MongoDB and try again.');
    }
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).send('Person not found');
    }
    res.render('delete', { person });
  } catch (error) {
    res.status(500).send('Error fetching person: ' + error.message);
  }
});

// DELETE /person/:id - Delete a person
app.delete('/person/:id', async (req, res) => {
  try {
    if (!checkMongoConnection()) {
      return res.status(503).send('MongoDB is not connected. Please start MongoDB and try again.');
    }
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).send('Person not found');
    }
    res.redirect('/person');
  } catch (error) {
    res.status(500).send('Error deleting person: ' + error.message);
  }
});

// Root redirect to /person
app.get('/', (req, res) => {
  res.redirect('/person');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

