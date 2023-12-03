import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    riotName: String,
    riotTag: String,
    discordTag: String
});

const Model = mongoose.model('User', userSchema);

export { Model as UserSchema }