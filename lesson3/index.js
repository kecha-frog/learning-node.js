const events = require('events')

const startTimer = (date, name) => {
  const idIntervals = setInterval(() => console.log(`[${name}] : ${((date - Date.now()) / 1000).toFixed()} секунд`), 1000)
  setTimeout(() => {
    ee.emit('end_timer', name)
    clearInterval(idIntervals)
  }, date - Date.now())
}

const ee = new events.EventEmitter()
ee.on('start_timer', startTimer)
ee.on('end_timer', (name) => console.log(`Таймер ${name} закончился `))

const setTimer = (arg) => {
  let count = 0

  for (const argElement of arg) {
    const time = argElement.split('-').reverse()
    const date = new Date(...time)
    const name = `timer${count++}`

    ee.emit('start_timer', date, name)
  }
}

setTimer(process.argv.slice(2))
