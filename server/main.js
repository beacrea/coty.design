const express = require('express')
const cors = require('cors')
const proxy = require('http-proxy-middleware')
const app = express()
let base = 'Projects'
let options_projects = {
  logLevel: 'debug',
  target: 'https://api.airtable.com/v0/' + process.env.AIRTABLE_ID + '/' + base,
  changeOrigin: true,
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + process.env.AIRTABLE_KEY
  },
  secure: false,
  pathRewrite: {
    '^/api' : ''
  },
  ssl: {
    rejectUnauthorized: false
  }
}

// Airtable Table Defs
let proxy_projects = setBase('Projects')
let proxy_companies = setBase('Companies')

// Enables multiple base requests
function setBase (baseName) {
  base = baseName
  return options_projects
}

// CORS and JSON Config
app.use(cors())
app.set('json spaces', 40)

// Route handler
app.get('/', function(req, res) {
  res.send('Yo! This is the backend server of Coty Beasley. (https://coty.design)')
})
app.use('/projects', proxy(proxy_projects))
app.use('/companies', proxy(proxy_companies))

// Port listener
app.listen(9000, () => console.log('Example app listening on port 9000!'))

module.exports = app