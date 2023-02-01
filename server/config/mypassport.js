const passport = require('passport')
const LocalStrat =  require('passport-local').Strategy

module.exports = function localStrategy(tools) {
  async function verifyCB(username, password, done) {
    console.log(username)
    console.log(password)
    try {
      const result = await tools.sqlQuery(
        'SELECT * FROM userlist WHERE username=?',
        [username]
      )
      console.log(result)
      let user
      if(result.length < 1) return done(null, false)
      else user = result[0]
      if(tools.validatePass(password, user.password_hash, user.hash_salt)) return done(null, user)
      else return done(null, false)
    } catch (error) {
      return done(error)
    }
  }

  const Strategy = new LocalStrat({usernameField: 'username', passwordField: 'password'}, verifyCB)
  passport.use(Strategy)

  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await tools.sqlQuery('SELECT user_id, username, age, created_date FROM userlist WHERE user_id=?', [id])
      if(result.length < 1) done(new Error('no user found in deserializeUser'))
      else done(null, result[0])
    } catch (error) {
      done(error)
    }
  })

  return passport
}