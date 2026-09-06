import eventsDAO from "../dao/events.dao.js";

class EventsRepository {

  async create(eventData) {
    return await eventsDAO.create(eventData);
  }

  async findById(id) {
    return await eventsDAO.findById(id);
  }

  async findAll(filters = {}, options = {}) {
    return await eventsDAO.findAll(filters, options);
  }

  async count(filters = {}) {
    return await eventsDAO.count(filters);
  }

  async update(id, eventData) {
    return await eventsDAO.update(id, eventData);
  }

}

export default new EventsRepository();