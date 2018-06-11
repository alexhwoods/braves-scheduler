const Twilio = require('twilio')
const fs = require('fs')

const data = require('./bravesSchedule.json')

const getCurrentDate = () => {
  const now = new Date()
  const date = now.toLocaleDateString('en-US')
  const [month, day, year] = date.split('/')
  const newMonth = month.length === 1 ? `0${month}` : month
  const newDay = day.length === 1 ? `0${day}` : day
  return `${newMonth}/${newDay}/${year.slice(-2)}`
}

const sendMessageToAlex = content => {
  const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  )
  const options = {
    to: `+ ${process.env.ALEX_PHONE_NUMBER}`,
    from: `+ ${process.env.TWILIO_PHONE_NUMBER}`,
    body: content,
  }

  client.messages.create(options, (error, response) => {
    if (error) console.log(error)
    else console.log(response)
  })
}

const sendBravesGame = () => {
  const date = getCurrentDate()
  const game = data[date]

  if (game) {
    const { subject, startTime, description } = game
    const message = sendMessageToAlex(
      `Braves game today! \n\n${subject} @ ${startTime}. \n\n Find it on:\n${description}. \n\nGo Braves!`,
    )
  }
}

sendBravesGame()
