import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    puuid: String,
    discordTag: String
});

const Model = mongoose.model('User', userSchema);

export { Model as UserSchema }