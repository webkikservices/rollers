const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "e-commerce",
  });

// Hardcoded user data (for demonstration purposes)
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' }
];

// Login route
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;
  
    // Find the user in the hardcoded data
    const user = users.find(u => u.username === username && u.password === password);
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    // If the user is found, send back the user details (including the role)
    res.json(user);
});
  
app.post('/fill-stock', (req, res) => {
    const { model, brand, category, sizes, quantity, imageUrl } = req.body;
  
    // Validate that required fields are present
    if (!model || !brand || !category || !sizes || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Convert sizes to a comma-separated string
    const sizesString = sizes.join(',');
  
    // Insert new details into the database
    const sql = 'INSERT INTO details (model, brand, category, sizes, quantity, imageUrl) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [model, brand, category, sizesString, quantity, imageUrl], (err, results) => {
      if (err) {
        console.error('MySQL query error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      // Return the details of the added item along with the ID
      const insertedId = results.insertId;
      const addedDetails = { id: insertedId, model, brand, category, sizes, quantity, imageUrl };
      res.json(addedDetails);
    });
  });
  

  
  

// Start the server
app.listen(8082, () => {
    console.log("listening on");
  });
  
