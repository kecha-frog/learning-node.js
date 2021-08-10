#!/usr/bin/env node

const fs = require('fs')
const inquirer = require('inquirer')
const path = require('path')

const previousFolder = (lastPath) => {
  questionPath(lastPath)
}

const findAndWriteStr = (str, path) => {
  const writeStream = fs.createWriteStream(`C:\\Users\\lllll\\WebstormProjects\\gb_node\\lesson4\\${str}_requests.log`, {
    flags: 'a',
    encoding: 'utf-8'
  }) // Не успел сделать путь сохранения файла.

  const readStream = fs.createReadStream(path, 'UTF-8')

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
      writeStream.end(() => console.log('Конец записи файла!'))
    }
  })
  readStream.on('error', (err) => console.log(err))
}

const questionStr = (path) => {
  console.clear()

  inquirer
    .prompt([{
      name: 'str',
      type: 'input',
      message: 'Find str in file: '
    }])
    .then(answer => answer.str)
    .then(str => {
      findAndWriteStr(str, path)
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
      if (answer === up) { // Не смог пофиксить фантомную консоль при выборе трех точек
        previousFolder('C:\\Users\\lllll\\WebstormProjects\\gb_node\\lesson3') // Не смог придумать как реализовать предыдущую папку
      }

      const valuePath = path.join(lastPath, answer)

      if (!fs.lstatSync(valuePath).isFile()) {
        questionPath(valuePath)
      } else {
        questionStr(valuePath)
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
  .then(path => questionPath(path))
  .catch(error => console.log(error))
