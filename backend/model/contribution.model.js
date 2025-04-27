import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date, 
    required: true,
  },
  contributionCount: {
    type: Number,
    default: 1,
  }
});

// ✅ Ensure unique (userId + date) combination
contributionSchema.index({ userId: 1, date: 1 }, { unique: true });


const Contribution = mongoose.model("Contribution", contributionSchema);
export default Contribution;
