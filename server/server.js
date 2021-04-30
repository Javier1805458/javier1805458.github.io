const express = require('express')
const app = express()
const mysql = require('mysql')
const myconn = require('express-myconnection')
const cors = require('cors')
const path = require('path')

app.use(myconn(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'images'
}))
app.use(cors())

app.use(express.static(path.join(__dirname, 'dbimages')))

app.use(require('./routes/routes'))

app.listen(9000, () => {
    console.log('server running on', 'http://localhost:' + 9000)
})