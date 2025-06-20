import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic Identification
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  // Authentication Methods
  password: { 
    type: String, 
    select: false 
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true,
  },

  // Profile Information
  fullName: { 
    type: String, 
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: async function(username) {
        const user = await this.constructor.findOne({ 
          userName: { $regex: new RegExp(`^${username}$`, 'i') },
          _id: { $ne: this._id }
        });
        return !user;
      },
      message: props => `Username '${props.value}' is already taken (case-insensitive check)`
    }
  },
  avatar: { type: String, default: "" },
  cover:  { type: String, default: "" },

  // Account Status
  hasGoogleAuth:        { type: Boolean, default: false },
  currentStreak:        { type: Number,  default: 0 },
  maxStreak:            { type: Number,  default: 0 },
  lastContributionDate: { type: Date,    default: null }
}, 
{ 
  timestamps: true,
  // Define collation at schema level for case-insensitive sorting
  collation: { locale: 'en', strength: 2 }
});

// Create the unique index separately
userSchema.index({ userName: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;