require('dotenv').config();
const express = require('express');
const path = require("path");
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const pingRoute = require('./routers/ping');
const apkRouter = require('./routers/apkRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err));

app.use('/api/apks', apkRouter);


app.use('/api/ping', pingRoute);


app.get('/', (req, res) => {
  res.json({ message: 'Hello from the server' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 5000}`);
});
