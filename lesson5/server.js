#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const http = require('http')
const url = require('url')

const createLink = (pathDir, value) => {
  if (!fs.lstatSync(path.join(pathDir, value)).isFile()) {
    return `<a href=${'http://localhost:3000/?type=dir&name=' + value}>[Dir] ${value}</a><br>`
  } else {
    return `<a href=${'http://localhost:3000/?type=file&name=' + value}>[File] ${value}</a><br>`
  }
}

const server = http.createServer((req, res) => {
  const currentDirection = 'C:\\Users\\lllll\\WebstormProjects\\gb_node'
  const dirLink = fs.readdirSync(currentDirection).reverse()
  const { type, name } = url.parse(req.url, true).query
  console.log(type, name)

  if (type === 'file') {
    const readStream = fs.createReadStream(path.join(currentDirection, name), { encoding: 'utf8' })
    readStream.on('data', chunk => res.write(chunk))
    readStream.on('end', () => res.end())
  } else {
    res.writeHead(200, 'ok', {
      'Content-Type': 'text/html'
    })

    dirLink.map(value => res.write(createLink(currentDirection, value)))
    res.end()
  }
})

server.listen(3000, 'localhost')

/*

const fs = require('fs')
const inquirer = require('inquirer')
const path = require('path')

const findAndWriteStr = (str, pathUser, file) => {
  const writeFilePath = `${path.join(pathUser, str)}_requests.log`
  const writeStream = fs.createWriteStream(writeFilePath, {
    flags: 'a',
    encoding: 'utf-8'
  })

  const userFilePath = path.join(pathUser, file)
  const readStream = fs.createReadStream(userFilePath, 'UTF-8')

  let count = 0

  readStream.on('data', (chunk) => {
    chunk.split('\n')
      .forEach((value) => {
        if (value.includes(str)) {
          count++
          writeStream.write(value + '\n')
        }
      })
  })

  readStream.on('end', () => {
    console.log('Конец чтения файла!')
    console.log(`Найдено строк: ${count}`)

    if (count) {
      writeStream.end(() => console.log(`Конец записи файла! ${writeFilePath}`))
    } else if (!count) {
      fs.unlink(writeFilePath, err => err ? console.log(err) : console.log('Конец работы программы!.'))
    }
  })

  readStream.on('error', (err) => console.log(err))
}

const questionStr = (path, file) => {
  console.clear()

  inquirer
    .prompt([{
      name: 'str',
      type: 'input',
      message: 'Find str in file: '
    }])
    .then(answer => answer.str)
    .then(str => {
      findAndWriteStr(str, path, file)
    })
    .catch(error => console.log(error))
}

const questionPath = (answer) => {
  const lastPath = answer
  const dirLink = fs.readdirSync(lastPath).reverse()
  const up = '(...)'
  dirLink.unshift(up)

  console.clear()

  inquirer
    .prompt([{
      name: 'fileName',
      type: 'list',
      message: `Choose path or file... \n\nCurrent direction: ${lastPath}`,
      choices: dirLink
    }])
    .then(answer => answer.fileName)
    .then(answer => {
      if (answer === up) {
        questionPath(lastPath.substring(0, lastPath.lastIndexOf('\\')))
      } else {
        const valuePath = path.join(lastPath, answer)

        if (!fs.lstatSync(valuePath).isFile()) {
          questionPath(valuePath)
        } else {
          questionStr(lastPath, answer)
        }
      }
    })
    .catch(error => console.log(error.path))
}

inquirer
  .prompt([{
    name: 'path',
    type: 'input',
    message: 'Enter folder path: '
  }])
  .then(answer => answer.path)
  .catch(error => console.log(error))
  .then(path => questionPath(path))
*/
