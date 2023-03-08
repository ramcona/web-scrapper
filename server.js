const schedule = require('node-schedule')
const {scrapeTokopedia} = require("./tokopedia.js")

schedule.scheduleJob('* * * * *', function(){
  console.log("get data from tokopedia")
  scrapeTokopedia()
})

