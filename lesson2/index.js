const events = require('events')

const startTimer = (date, name) => {
  const idIntervals = setInterval(() => {
    const seconds = ((date - Date.now()) / 1000).toFixed()
    const minute = (seconds / 60) % 60
    const hour = seconds / (60 * 60)
    console.log(`[${name}] ${Math.floor(hour)} : ${Math.floor(minute)} : ${Math.floor(seconds % 60)}`)
  }, 1000)

  setTimeout(() => {
    ee.emit('end_timer', idIntervals)
  }, date - Date.now())
}

const ee = new events.EventEmitter()

ee.on('start_timer', startTimer)
ee.on('end_timer', (idIntervals) => {
  clearInterval(idIntervals)
})

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
