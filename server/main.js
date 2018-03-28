const express = require('express')
const cors = require('cors')
const proxy = require('http-proxy-middleware')
const app = express()

// Table Options
const options_projects = {
  target: 'https://api.airtable.com/v0/' + process.env.AIRTABLE_ID + '/Projects',
  logLevel: 'debug',
  changeOrigin: true,
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + process.env.AIRTABLE_KEY
  },
  secure: false,
  pathRewrite: {
    '^/projects' : ''
  },
  ssl: {
    rejectUnauthorized: false
  }
}
const options_companies = {
  target: 'https://api.airtable.com/v0/' + process.env.AIRTABLE_ID + '/Companies',
  logLevel: 'debug',
  changeOrigin: true,
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + process.env.AIRTABLE_KEY
  },
  secure: false,
  pathRewrite: {
    '^/companies' : ''
  },
  ssl: {
    rejectUnauthorized: false
  }
}

// CORS and JSON Config
app.use(cors())
app.set('json spaces', 40)

// Route handler
app.get('/', function(req, res) {
  res.send('Yo! This is the backend server of Coty Beasley. (https://coty.design)')
})
app.use('/projects', proxy(options_projects))
app.use('/companies', proxy(options_companies))

// Port listener
app.listen(9000, () => console.log('Example app listening on port 9000!'))

module.exports = app