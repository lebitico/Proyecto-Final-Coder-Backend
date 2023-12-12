import CategoryModel from "./models/category.mongo.model.js";

export default class CategorysMongo {
  async addCategory(data) {
    try {
      if (data) return await CategoryModel.create(data);
      return null;
    } catch (error) {
      throw error;
    }
  }
  async getCategorys() {
    try {
      return await CategoryModel.find().lean().exec();
    } catch (error) {
      throw error;
    }
  }
  async getCategoryById(id) {
    try {
      if (id) return await CategoryModel.findById(id).lean().exec();
    } catch (error) {
      throw error;
    }
  }
  async updateCategory(id, data) {
    try {
      if ((id, data)) {
        return await CategoryModel.findByIdAndUpdate(id, data);
      }
    } catch (e) {
      throw e;
    }
  }
  async deleteCategory(id) {
    try {
      if (id) {
        return await CategoryModel.findByIdAndDelete(id);
      }
    } catch (e) {
      throw e;
    }
  }
  async getCategoryPaginate(page, limit) {
    try {
      if ((page, limit)) {
        const category = await CategoryModel.paginate(
          {},
          { page: page || 1, limit: limit || 50, lean: true }
        );
        return category;
      }
    } catch (e) {
      throw e;
    }
  }
}