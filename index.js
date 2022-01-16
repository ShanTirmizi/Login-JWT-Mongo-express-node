const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

// import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, () =>
  console.log('Connected to MongoDB')
);

// Middlewares
app.use(express.json());

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/post', userRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
