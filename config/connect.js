"use strict";

import mongoose from "mongoose";

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}

export default connectDB;