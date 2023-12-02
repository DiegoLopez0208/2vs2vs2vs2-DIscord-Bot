import mongoose from "mongoose";
const { Schema } = mongoose;

const matchSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    charSelected: String,
    banSelected: String,
    playedAt: Number,
    position: Number,
});

const Model = mongoose.model('Match', matchSchema);

export { Model as MatchSchema }
