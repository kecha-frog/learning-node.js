const color = require('colors')
const userInput = [+process.argv[2], +process.argv[3]]
const numArray = [];
let colorLog = 'green'

if (isNaN(userInput[0]) || isNaN(userInput[1])) {
  console.log(`${process.argv[2]}, ${process.argv[3]} - один из аргументов не является числом!`)
} else {
  nextPrime:
      for (let i = userInput[0] < 2 ? 2 : userInput[0]; i <= userInput[1]; i++) {
        for (let j = 2; j < i; j++) {
          if (i % j === 0) continue nextPrime;
        }

        if(colorLog === 'green' ){
          numArray.push(i.toString().green)
          colorLog = 'yellow'
        }else if (colorLog === 'yellow' ){
          numArray.push(i.toString().yellow)
          colorLog = 'red'
        }else if (colorLog === 'red' ){
          numArray.push(i.toString().red)
          colorLog = 'green'
        }
      }

  if (numArray.length !== 0){
    console.log(numArray.toString())
  }else {
    console.log(`Нет простых чисел в указанном диапазоне`.red)
  }
}





