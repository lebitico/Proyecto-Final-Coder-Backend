import UserModel from "./models/users.mongo.model.js";

export default class User {
  getUsers = async () => {
    return await UserModel.find();
  };
  getUserById = async (id) => {
    return await UserModel.findOne({ _id: id });
  };
  
  createUsers = async (user) => {
    try {
      if (data) return await UserModel.create(user);
    } catch (error) {
      throw error;
    }
    return await UserModel.create(user);
  };

  getUserByEmail = async (email) => {
    try {
      if (email) {
        const user = await UserModel.findOne({ email: email });
        if (user) return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  getUserByEmailCode = async (email, verificationCode) => {
    try {
      if ((email, verificationCode)) {
        const user = await UserModel.findOne({ email, verificationCode });
        return user;
      }
    } catch (e) {
      throw e;
    }
  };
  async updateUser(id, data) {
    try {
      if ((id, data)) {
        const user = await UserModel.findByIdAndUpdate(id, data);
        const userDB = await UserModel.findById(id);
        return userDB;
      }
    } catch (e) {
      throw e;
    }
  }
  deleteUserById = async (uid) => {
    return await UserModel.findByIdAndDelete(uid);
  };

  async inactiveUser() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const inactiveUsers = await UserModel.find({
      last_connection: { $lt: twoDaysAgo },
    });
    if (inactiveUsers.length > 0) {
      await UserModel.deleteMany({
        _id: { $in: inactiveUsers.map((user) => user._id) },
      });
    }
    return inactiveUsers;
  }
}
