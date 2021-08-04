const events = require('events')

const startTimer = (date, name) => {
  const idIntervals = setInterval(() => {
    const time = ((date - Date.now()) / 1000).toFixed()
    console.log(`[${name}] ${Math.floor(time / (60 * 60))} : ${Math.floor((time / 60) % 60)} : ${Math.floor(time % 60)}`)
  }, 1000)

  setTimeout(() => {
    ee.emit('end_timer', name, idIntervals)
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
