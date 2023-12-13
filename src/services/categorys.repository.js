import categoryDTO from "../DAO/DTO/category.dto.js";

export default class CategoryRepository {
  constructor(categoryDAO) {
    this.categoryDAO = categoryDAO;
  }
  async addCategory(data) {
    try {
      const category = await this.categoryDAO.addCategory(data);
      return new categoryDTO(category);
    } catch (error) {
      throw error;
    }
  }
  async getCategorys() {
    try {
      const category = await this.categoryDAO.getCategorys();
      return category.map((category) => new categoryDTO(category));
    } catch (error) {
      throw error;
    }
  }
  async getCategoryById(id) {
    try {
      const category = await this.categoryDAO.getCategoryById(id);
      return new categoryDTO(category);
    } catch (error) {
      throw error;
    }
  }
  async updateCategory(id, data) {
    try {
      const category = await this.categoryDAO.updateCategory(id, data);
      return new categoryDTO(category);
    } catch (error) {
      throw error;
    }
  }

  async categoryPaginate(page, limit) {
    try {
      const category = await this.categoryDAO.categoryPaginate(page, limit);
      return category.map((category) => new categoryDTO(category));
    } catch (e) {
      throw e;
    }
  }
}
