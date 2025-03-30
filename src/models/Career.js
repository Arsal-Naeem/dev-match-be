import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  traits: [String],
});

export default mongoose.model("Career", CareerSchema);
