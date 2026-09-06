import eventsDAO from "../dao/events.dao.js";

class EventsRepository {
  async create(eventData) {
    return await eventsDAO.create(eventData);
  }

  async findById(id) {
    return await eventsDAO.findById(id);
  }

  async findAll() {
    return await eventsDAO.findAll();
  }

  async update(id, eventData) {
    return await eventsDAO.update(id, eventData);
  }

  async delete(id) {
    return await eventsDAO.delete(id);
  }
}

export default new EventsRepository();
