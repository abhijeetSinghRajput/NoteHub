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

// 🛡️ Normalize date to midnight before saving
contributionSchema.pre("save", function (next) {
  this.date.setUTCHours(0, 0, 0, 0); 
  next();
});

// 🛡️ normalize date on update
contributionSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.date) {
    this._update.date.setUTCHours(0, 0, 0, 0);
  }
  next();
});

const Contribution = mongoose.model("Contribution", contributionSchema);
export default Contribution;
