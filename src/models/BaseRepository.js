// models/BaseRepository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async getAll(filter = {}) {
    // filter can include options like where, attributes, include
    return this.model.findAll(filter);
  }

  async getById(id) {
    return this.model.findByPk(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    // First update the entity
    await this.model.update(data, { 
      where: { id },
      individualHooks: true // Ensure hooks run (important for password hashing, etc.)
    });
    
    // Then fetch and return the updated entity
    return this.getById(id);
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }
}

module.exports = BaseRepository; 