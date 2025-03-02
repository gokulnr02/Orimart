import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    Path: { type: String ,required:true},
    Name: { type: String ,required:true},
    Size: { type: Number ,required:true},
    type: { type: String ,required:true}
  },
  {
    timestamps: true
  }
);

// Check if the model is already defined before creating a new one
const Upload = mongoose.models.Upload || mongoose.model("Upload", uploadSchema);

export default Upload;
