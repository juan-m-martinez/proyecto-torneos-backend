import User from "../models/User.js";

class UsersDAO {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findAll() {
    return await User.find().select("-password");
  }

  async findById(id) {
    return await User.findById(id).select("-password");
  }

}

export default new UsersDAO();
