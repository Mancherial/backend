import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { sitemapRouter } from './sitemap.js';


import connectDB, { getDB } from './db.js';
import moment from 'moment-timezone';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
await connectDB();

// Middleware
app.use('/', sitemapRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API working!' });
});

app.post('/contact', async (req, res) => {
  const { username, userPhone, userWtsp, message } = req.body;

  const dateIST = moment().tz('Asia/kolkata').format('YYYY-MM-DD HH:mm:ss');
  if (!username || !userPhone || !message || !userWtsp) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const db = getDB();
    await db.collection("users").insertOne({
      username,
      userPhone,
      userWtsp,
      message,
      submittedAt: dateIST,
    }).then((result)=>{
      res.status(200).json({ message: "Successful" });
    }).catch((err)=>{
      console.log(err)
    });


  } catch (err) {
    console.error("❌ Insert error:", err.message);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
