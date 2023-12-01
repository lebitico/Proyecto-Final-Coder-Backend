import UserDTO from "../DAO/DTO/users.dto.js";

export default class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    getUsers = async () => { return await this.dao.getUsers() }
    getUserById = async(id) => { return await this.dao.getUserById(id) }
    getUserByEmail = async(email) => { return await this.dao.getUserByEmail(email) }
    createUsers = async(user) => { 
        const userToInsert = new UserDTO(user)
        return await this.dao.createUsers(userToInsert)
        
    }
    deleteUserById = async (uid) => {
        const result = await this.dao.deleteUserById(uid)
        return result
    }
}