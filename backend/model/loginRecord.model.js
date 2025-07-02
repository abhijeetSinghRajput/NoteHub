// models/LoginRecord.js
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  country: String,
  region: String,
  city: String,
  coordinates: {
    type: [Number], // [longitude, latitude]
    index: "2dsphere",
  },
}, { _id: false });

const deviceSchema = new mongoose.Schema({
  os: {
    name: String,
    version: String,
  },
  browser: {
    name: String,
    version: String,
  },
  vendor: String,
  model: String,
  type: String,
}, { _id: false });

const loginRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    loginTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    device: deviceSchema,
    userAgent: String,
    location: locationSchema,
    authMethod: {
      type: String,
      enum: ["email", "google", "facebook", "github", "apple"],
      required: true,
    },
    tokenExpiry: {
      type: Date,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true
    },
    sessionDuration: {
      type: Number, // in seconds
      default: null
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

// Indexes for performance
loginRecordSchema.index({ userId: 1, isRevoked: 1 });
loginRecordSchema.index({ tokenExpiry: 1 }, { expireAfterSeconds: 0 });

// Virtual for active status
loginRecordSchema.virtual('isActive').get(function() {
  return !this.isRevoked && this.tokenExpiry > new Date() && !this.logoutTime;
});

// Calculate duration before saving
loginRecordSchema.pre('save', function(next) {
  if (this.logoutTime && this.isModified('logoutTime')) {
    this.sessionDuration = Math.floor(
      (this.logoutTime - this.loginTime) / 1000
    );
  }
  next();
});

const LoginRecord = mongoose.model("LoginRecord", loginRecordSchema);

export default LoginRecord;