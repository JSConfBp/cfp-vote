module.exports = (index) => {
  const charcodedIndex = index + 64

  if ((charcodedIndex) <= 90) {
    return String.fromCharCode(charcodedIndex)
  }

  const firstLetter = String.fromCharCode(Math.floor(index / 26) + 64)
  const secondLetter = String.fromCharCode((index % 26) + 64)

  return `${firstLetter}${secondLetter}`
}



