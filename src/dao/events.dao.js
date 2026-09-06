import Event from "../models/Event.js";

class EventsDAO {
  async create(eventData) {
    return await Event.create(eventData);
  }

  async findById(id) {
    return await Event.findById(id);
  }

  async findAll() {
    return await Event.find();
  }

  async update(id, eventData) {
    return await Event.findByIdAndUpdate(id, eventData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Event.findByIdAndDelete(id);
  }
}

export default new EventsDAO();