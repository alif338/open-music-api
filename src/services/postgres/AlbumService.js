const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapDBToAlbumModel, mapDBToSongsModel } = require("../../../utils");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO albums VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, year, createdAt, updatedAt]
    }

    const result = await this._pool.query(query);

    console.log(`HASIL ALBUM ${result.rows[0]}`); 
    console.log(`JUMLAH ALBUM ${result.rowCount}`); 

    if (!result.rows[0].id) {
      throw new InvariantError('Album was not created');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM albums WHERE id = $1`,
      values: [id]
    }
    const query2 = {
      text: `SELECT * FROM songs WHERE album_id = $1`,
      values: [id]
    }

    const result = await this._pool.query(query);
    const result2 = await this._pool.query(query2);

    if (!result.rows.length) {
      throw new NotFoundError('Album was not found');
    }

    return [result.rows.map(mapDBToAlbumModel)[0], result2.rows.map(mapDBToSongsModel)];
  }

  async getSongsByAlbumId(id) {
    const query = {
      text: `SELECT * FROM songs WHERE album_id = $1`,
      values: [id]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to get songs. Album was not found');
    }

    return result.rows.map(mapDBToSongsModel);
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id`,
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update Album. Album was not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM albums WHERE id = $1 RETURNING id`,
      values: [id]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete Album. Album was not found');
    }
  }
}

module.exports = AlbumService;