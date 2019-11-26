const { download } = require('../../services/cfp')
const XLSX = require('xlsx')
const csv = require('csv')

const toXLS = async (data) => {

	// make the worksheet
	const ws = XLSX.utils.json_to_sheet(data);

	// add to workbook
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "CFP");

	// write workbook
	const buf = XLSX.write(wb, {
		bookType: 'xlsx',
		type: 'buffer',
		bookSST: true,
	});

	return buf
}

const toCSV = async (data) => (new Promise((resolve, reject) => {
  csv.stringify(
    data,
    {
      header: true
    },
    (err, result) => {
      if (err) return reject(err)

      resolve(result)
    }
  )
}))

module.exports = async (request, response, next) => {
  try {
    const data = await download(request)
    const { accept } = request.headers

    if (accept.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      const xls = await toXLS(data)
      response
        .set("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8')
        .send(xls)
    } else if (accept.startsWith('text/csv')) {
      const csv = await toCSV(data)
      response
        .set("Content-Type", 'text/csv;charset=utf-8')
        .send(csv)
    } else {
      response
        .set("Content-Type", 'application/json')
        .send(JSON.stringify(data))
    }
  } catch(e) {
    next(e)
  }
}
