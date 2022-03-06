const { Pool } = require("pg");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({title, year, genre, performer, duration = undefined, albumId = undefined}) {}

  async getSongs() {}

  async getSongById(id) {}

  async editSongById(id, {title, year, genre, performer, duration = undefined, albumId = undefined}) {}

  async deleteSongById(id) {}
}

module.exports = SongsService;