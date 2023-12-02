import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema({
    name: String,
    memberid1: { type: Schema.Types.ObjectId, ref: 'User' },
    memberid2: { type: Schema.Types.ObjectId, ref: 'User' },
    icon: String,
    points: Number
});

const Model = mongoose.model('Group', groupSchema);

export { Model as GroupSchema }
