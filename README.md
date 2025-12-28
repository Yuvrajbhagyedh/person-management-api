# Person Management RESTful Web Service

A RESTful web service built with Node.js, Express, and MongoDB for managing person records.

## Features

- **GET /person** - Display a table with a list of all people
- **POST /person** - Display a form to create a new person
- **PUT /person/:id** - Display a form to edit and update a person by ID
- **DELETE /person/:id** - Display a page to delete a person by ID

## Person Schema

Each person record contains the following fields:
- Name (String, required)
- Age (Number, required)
- Gender (String, required: Male/Female/Other)
- Mobile Number (String, required)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas connection string)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system. If using a remote MongoDB, set the `MONGODB_URI` environment variable:
```bash
# Windows
set MONGODB_URI=mongodb://your-connection-string

# Linux/Mac
export MONGODB_URI=mongodb://your-connection-string
```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

By default, the application connects to MongoDB at `mongodb://localhost:27017/persondb`

## Usage

1. **View all people**: Navigate to `http://localhost:3000/person`
2. **Create a person**: Click "Add New Person" or go to `http://localhost:3000/person/new`
3. **Edit a person**: Click "Edit" button next to any person in the list
4. **Delete a person**: Click "Delete" button next to any person in the list

## Project Structure

```
mongodoctors/
├── server.js          # Main server file with routes and MongoDB connection
├── package.json       # Dependencies and scripts
├── views/            # EJS templates
│   ├── list.ejs      # List all people
│   ├── create.ejs    # Create new person form
│   ├── edit.ejs      # Edit person form
│   └── delete.ejs    # Delete confirmation page
└── public/           # Static files
    └── style.css     # Stylesheet
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **EJS** - Templating engine
- **Body Parser** - Parse request bodies
- **Method Override** - Support for PUT/DELETE methods in HTML forms


