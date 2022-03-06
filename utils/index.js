const mapDBToAlbumModel = ({
  id,
  title,
  year,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year,
  createdAt: created_at,
  updatedAt: updated_at
});

const mapDBToSongsModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at
});

module.exports = { mapDBToAlbumModel, mapDBToSongsModel };