import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { stringify } from 'csv'
import XLSX from 'xlsx'

import download from '../../services/cfp/download'

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
  stringify(
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

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    const data = await download()
    const { accept } = req.headers

    if (accept.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      const xls = await toXLS(data)
      res
        .setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8')
        .send(xls)
    } else if (accept.startsWith('text/csv')) {
      const csv = await toCSV(data)
      res
        .setHeader("Content-Type", 'text/csv;charset=utf-8')
        .send(csv)
    } else {
      res
        .setHeader("Content-Type", 'application/json')
        .send(JSON.stringify(data))
    }

    return;
  }

  res.status(405).send()
}
