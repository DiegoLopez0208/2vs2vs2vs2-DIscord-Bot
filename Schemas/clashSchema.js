import mongoose from "mongoose";
const { Schema } = mongoose;

const clashSchema = new Schema({
    rest: String,
    plays: [String],
    played: { type: Boolean, default: false },
});

const Model = mongoose.model("Clash", clashSchema);

export { Model as ClashSchema };
