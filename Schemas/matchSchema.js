import mongoose from "mongoose";
const { Schema } = mongoose;

const matchSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  charSelected: String,
  playedAt: String,
  placement: String,
  matchId: String,
  puuid: String,
  discordTag: String,
});

const Model = mongoose.model("Match", matchSchema);

export { Model as MatchSchema };
