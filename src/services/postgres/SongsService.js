const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapDBToSongsModel, mapDBToSongDetailModel } = require("../../../utils");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, 
    year, 
    genre, 
    performer, 
    duration, 
    albumId
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt]
    }

    const result = await this._pool.query(query);

    if(!result.rows[0].id) {
      throw new InvariantError('Song was not created');
    }

    return result.rows[0].id;
  }

  async getSongs(title = '', performer = '') {
    const query = {
      text: `SELECT * FROM songs WHERE UPPER(title) LIKE UPPER('%'||$1||'%') AND UPPER(performer) LIKE UPPER('%'||$2||'%')`, 
      values: [title, performer]
    }
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToSongsModel);
  }

  async getSongById(id) {
    const result = await this._pool.query(`SELECT * FROM songs WHERE id = $1`, [id]);
    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
    return result.rows.map(mapDBToSongDetailModel)[0];
  }

  async editSongById(
    id, {
      title, 
      year, 
      genre, 
      performer, 
      duration = undefined, 
      albumId = undefined
    }
  ) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, updatedAt, id]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update Song. Song was not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM songs WHERE id = $1 RETURNING id`,
      values: [id]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete Song. Song was not found');
    }
  }
}

module.exports = SongsService;