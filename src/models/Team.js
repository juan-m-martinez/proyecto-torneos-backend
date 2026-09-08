import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        captain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        teamPassword: {
            type: String,
            required: true,
            trim: true,
        },
    },

    { timestamps: true }

);

teamSchema.index({ event: 1, name: 1 }, { unique: true }); // equipos repetidos en el mismo evento ❌

const Team = mongoose.model("Team", teamSchema);

export default Team;