const express = require('express')
const cors = require('cors')
const proxy = require('http-proxy-middleware')
const app = express()

// Table Options
const optionsProjects = {
  target: 'https://api.airtable.com/v0/' + process.env.AIRTABLE_ID + '/Projects',
  logLevel: 'debug',
  changeOrigin: true,
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + process.env.AIRTABLE_KEY
  },
  secure: false,
  pathRewrite: {
    '^/projects': ''
  },
  ssl: {
    rejectUnauthorized: false
  }
}
const optionsCompanies = {
  target: 'https://api.airtable.com/v0/' + process.env.AIRTABLE_ID + '/Companies',
  logLevel: 'debug',
  changeOrigin: true,
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + process.env.AIRTABLE_KEY
  },
  secure: false,
  pathRewrite: {
    '^/companies': ''
  },
  ssl: {
    rejectUnauthorized: false
  }
}

// CORS and JSON Config
app.use(cors())
app.set('json spaces', 40)

// Check request type
/**
 * @return {Boolean}
 */
let filter = function (pathname, req) {
  return (req.method === 'GET')
}

// Route handler
app.get('/', function(req, res) {
  res.send('Yo! This is the backend server of Coty Beasley. (https://coty.design)')
})
app.use('/projects', proxy(filter, optionsProjects))
app.use('/companies', proxy(filter, optionsCompanies))

// Port listener
app.listen(80, () => console.log('Example app listening on port 80!'))

module.exports = app