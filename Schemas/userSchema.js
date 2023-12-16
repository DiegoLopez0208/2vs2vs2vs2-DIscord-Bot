import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    riotName: String,
    riotTag: String,
    discordTag: String,
    discordId: String, 
    discordAvatarId: String,
    teamName: String,
    points: Number
});

const Model = mongoose.model('User', userSchema);

export { Model as UserSchema }
