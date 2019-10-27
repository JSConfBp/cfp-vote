const { promisify } = require('util')
const fs = require('fs')
const writeFile = promisify(fs.writeFile)
const csv = require('csv')
const casual = require('casual')
const dayjs = require('dayjs')

const dataToCSV = (data) => new Promise((resolve, reject) => {
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
})

const generateCfpData = (count = 100) => {
    return new Array(count).fill({}).map((o, i) => {
        return {
            'Timestamp': dayjs().subtract(count, 'days').add(i, 'hours').format(),
            'Presentation title': casual.title,
            'Presentation summary (abstract) to be displayed on the website': casual.sentences(n = 3),
            'More details on your Presentation': casual.sentences(n = 5),
            'Previous talks': '',
            'Do you require childcare?': (casual.boolean ? 'yes' : 'no, thank you'),
            'Do you have any food allergies or catering preferences?': '',
            'Anything you may need from us during your visit?': '',
            'Your name': casual.full_name,
            'Short bio': casual.catch_phrase,
            'Email address': casual.email,
            'Preferred pronoun': '',
            'Twitter': '',
            'Github': '',
            'Your website or blog URL': '',
            'Country and city from where you would travel to Budapest': `${casual.city}, ${casual.country}`,
            'A picture of you': '',
            'My company / employer can pay my trip to the conference': (casual.boolean ? 'yes' : 'no'),
            'Company Name': casual.company_name,
            'Code of Conduct': "I've read and agree with the Code of Conduct",
            'Privacy policy': "I consent to use my personal data according to the Privacy Policy",
        }
    })
}

(async () => {
    const num = 200
    try {
        const data = generateCfpData(num)
        const csv = await dataToCSV(data)
        const filename = `cfp-export_${casual.safe_color_name}.csv`
        await writeFile(filename, csv)
        
        console.log(`Success! ${filename} written with ${200} submitted CFPs`);
    } catch(e) {
        console.error(e);
    }

})()