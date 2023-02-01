// use express cookie instead of jwt
const express = require('express')
const session = require('express-session')
const expressMysqlSession = require('express-mysql-session')
const mysql = require('mysql')
const crypto = require('node:crypto')

const configureUtils = require('./utils')
const configurePassportjs = require('./config/mypassport')
const routeLogicGenerator = require('./routeLogic')
const signRoutes = require('./asignRoutes')

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'faiz1',
  password: '123',
  database: 'faizdb1'
})

const utils = configureUtils(pool, crypto)
// running passport config:
const passport = configurePassportjs(utils)

// database needed to store cookie data for security because if store undefined then 
// MemoryStorage will be used by express-session as default and it leaks/insecure/only for debuging.

const MysqlStore = expressMysqlSession(session)
const sessionStore = new MysqlStore({
  checkExpirationInterval: 1000 * 60 * 60 * 2
}, pool)

const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/front')
// to load the main.js etc
app.use(express.static(__dirname + '/front'))
app.use(express.json({limit: Infinity}))
app.use(express.urlencoded({limit: Infinity, extended: true}))
app.use(session({
  secret: process.env.SESSION_SECRET || 'love',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {maxAge: 1000 * 60 * 60 * 24, sameSite: 'lax'}
}))
app.use(passport.initialize())
app.use(passport.session())

const routeLogic = routeLogicGenerator(utils)
signRoutes(app, routeLogic, passport)


app.listen(process.env.PORT || 3000, () => {console.log('server running 3000')})