const express = require('express');
const cors = require('cors');


const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoute = require('./routes/authRoute');
const jobRoutes = require('./routes/jobRoutes');
const tockenRoute= require('./routes/tockenRoute')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;


connectDB();

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello fam" });
});

// API Routes
app.use('/api', userRoutes);
app.use('/api', authRoute);
app.use('/api', jobRoutes);
app.use('/api', tockenRoute)


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
