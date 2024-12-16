import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required:false },
  workLocation: { type:String, required:false },
  reraNumber: { type:String, required:false },
  avatar: { type: String, required: false },
  allProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  allRequirements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Requirement" }],
}, {timestamps: true});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
