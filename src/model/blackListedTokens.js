import mongoose from "mongoose";

const blacklistedSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: { type: Date, required: true, expires: 604800 },
});

const BlacklistedModel = mongoose.model("Blacklisted", blacklistedSchema);
export {BlacklistedModel}