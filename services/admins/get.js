
export default () => {
  const ADMINS = JSON.parse(process.env.ADMINS)

  return ADMINS
}
