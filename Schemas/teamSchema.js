import mongoose from "mongoose";
const { Schema } = mongoose;

const teamSchema = new Schema({
    name: String,
    memberid1: { type: Schema.Types.ObjectId, ref: 'User' },
    memberid2: { type: Schema.Types.ObjectId, ref: 'User' },
    points: Number
});

const Model = mongoose.model('Group', teamSchema);

export { Model as TeamSchema }
