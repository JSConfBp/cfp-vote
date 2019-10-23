module.exports = function ({ name, created_at: createdAt, updated_at: updatedAt }) {
  return {
    name,
    created_at: createdAt,
    updated_at: updatedAt
  }
}
