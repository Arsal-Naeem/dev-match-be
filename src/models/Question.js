import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [
    {
      text: String,
      traits: [String],
    },
  ],
});

export default mongoose.model("Question", QuestionSchema);
