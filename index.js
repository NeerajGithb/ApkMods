require('dotenv').config(); 

const express = require('express');
const path = require("path");
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authRouter = require('./routers/authRouter');
const apkRouter = require('./routers/apkRoutes');

const app = express();

app.use(
  cors({
    origin: 'https://apk-mode-frontend.vercel.app',
    credentials: true,
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api/auth', authRouter);
app.use('/api/apks', apkRouter);
// app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the server' });
});
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 5000}`);
});
