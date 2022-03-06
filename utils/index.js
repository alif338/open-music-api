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
  created_at: createdAt,
  updated_at: updatedAt
});

const mapDBToSongsModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createdAt: createdAt,
  updatedAt: updatedAt
});

module.exports = { mapDBToAlbumModel, mapDBToSongsModel };