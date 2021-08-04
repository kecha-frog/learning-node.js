const fs = require('fs')

const ipArray = ['89.123.1.41', '34.48.240.111']

const readStream = fs.createReadStream('./lesson3/access.log', 'UTF-8')
const writeStreamIp1 = fs.createWriteStream('./lesson3/89.123.1.41_requests.log', { flags: 'a', encoding: 'utf-8' })
const writeStreamIp2 = fs.createWriteStream('./lesson3/34.48.240.111_requests.log', { flags: 'a', encoding: 'utf-8' })

readStream.on('end', () => {
  console.log('Конец чтения файла access.log')

  writeStreamIp1.end(() => console.log('Конец записи 89.123.1.41_requests.log'))
  writeStreamIp2.end(() => console.log('Конец записи 34.48.240.111_requests.log'))
})
readStream.on('error', (err) => console.log(err))

readStream.on('data', (chunk) => {
  chunk.split('\n')
    .forEach((value) => {
      if (value.includes(ipArray[0])) {
        writeStreamIp1.write(value + '\n')
      } else if (value.includes(ipArray[1])) {
        writeStreamIp2.write(value + '\n')
      }
    })
})
