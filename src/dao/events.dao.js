import Event from "../models/Event.js";

class EventsDAO {
  async create(eventData) {
    return await Event.create(eventData);
  }

  async findById(id) {
    return await Event.findById(id);
  }

  async findAll(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = "date",
    } = options;

    const skip = (page - 1) * limit;

    return await Event.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async count(filters = {}) {
    return await Event.countDocuments(filters);
  }

  async update(id, eventData) {
    return await Event.findByIdAndUpdate(id, eventData, {
      new: true,
      runValidators: true,
    });
  }
}

export default new EventsDAO();