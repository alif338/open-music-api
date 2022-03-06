const { Pool } = require("pg");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({name, year}) {}

  async getAlbumById(id) {}

  async editAlbumById(id, {name, year}) {}

  async deleteAlbumById(id) {}
}

module.exports = AlbumService;