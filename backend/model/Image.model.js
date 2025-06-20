import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^(https?):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    },
    publicId: {
      type: String,
      required: true,
      index: true, 
      validate: {
        validator: function(v) {
          // Basic validation to ensure no special characters that might cause issues
          return /^[a-zA-Z0-9_\-/]+$/.test(v);
        },
        message: props => `${props.value} contains invalid characters!`
      }
    }
  },
  { 
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Compound index for better query performance
imageSchema.index({ userId: 1, publicId: 1 }); 

const Image = mongoose.model("Image", imageSchema);
export default Image;