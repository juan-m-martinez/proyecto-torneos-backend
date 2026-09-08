import usersDAO from "../dao/users.dao.js";

class UsersRepository {
  async findByEmail(email) {
    return await usersDAO.findByEmail(email);
  }

  async create(userData) {
    return await usersDAO.create(userData);
  }

  async findAll() {
    return await usersDAO.findAll();
  }

  async findById(id) {
    return await usersDAO.findById(id);
  }
}

export default new UsersRepository();