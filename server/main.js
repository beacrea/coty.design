const express = require('express')
const app = express()

app.set('json spaces', 40)

app.get('/', (req, res) => res.json({ coolguy: 'Dat boi, C-Beez' }))

app.listen(9000, () => console.log('Example app listening on port 9000!'))