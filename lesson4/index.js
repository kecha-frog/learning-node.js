#!/usr/bin/env node

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
