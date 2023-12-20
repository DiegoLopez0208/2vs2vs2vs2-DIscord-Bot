import mongoose from "mongoose";
const { Schema } = mongoose;

const teamSchema = new Schema({
  name: String,
  memberName1: String,
  memberName2: String,
  points: { type: Number, default: 0 },
  img: String,
});

const Model = mongoose.model("Team", teamSchema);

export { Model as TeamSchema };
