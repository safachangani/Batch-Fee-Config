const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const batchRoutes = require('./routes/batchRoutes')
const feeStructureRoutes = require('./routes/feeStructureRoutes')
const batchFeeRoutes = require('./routes/batchFeeRoutes')
const PORT = 5000;

app.use(express.json());
app.use(cors({
  origin: 'https://batch-fee-config-5.onrender.com',
  credentials: true
}));
dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/batchFeeConfig",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("mongodb connected");

  } catch (err) {
    console.log(err)
  }
}
connectDB();

app.use('/batch', batchRoutes);
app.use('/fee', feeStructureRoutes)
app.use('/batchfee', batchFeeRoutes);
app.listen(PORT, () => {
  console.log("server is running")
})
