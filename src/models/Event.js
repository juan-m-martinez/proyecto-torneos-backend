import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, /*nombre del torneo */
    description: { type: String, trim: true }, /* descripcion del torneo*/
    category: { type: String, trim: true },
    date: { type: Date },
    location: { type: String, trim: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }/* Usuario encargado del torneo */
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
