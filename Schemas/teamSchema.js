import mongoose from "mongoose";
const { Schema } = mongoose;

const teamSchema = new Schema({
    name: String,
    memberid1: String,
    memberid2: String,
    points: { type: Number, default: 0 },
    img: String
});

const Model = mongoose.model('Team', teamSchema);

export { Model as TeamSchema }
