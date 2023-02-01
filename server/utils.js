module.exports = function tools(connectionPool, crypto) {
  const hashIteration = 10000, hashKeylen = 45
  return {
    sqlQuery: function(queryStr, values) {
      return new Promise((resolve, reject) => {
        connectionPool.getConnection((err, conn) => {
          if(err) reject(err)
          const options = {sql: queryStr}
          if(values) options.values = values
          conn.query(options, (err2, result, fields) => {
            if(err2) reject(err2)
            resolve(result)
          })
          conn.release()
        })
      })
    },
    genPass: function(password) {
      const salt = crypto.randomBytes(20).toString('hex')
      const hash = crypto.pbkdf2Sync(password, salt, hashIteration, hashKeylen, 'sha512').toString('hex')
      return { salt, hash }
    },
    validatePass: function(password, hash, salt) {
      const questioned = crypto.pbkdf2Sync(password, salt, hashIteration, hashKeylen, 'sha512').toString('hex')
      return questioned === hash
    },
    validateData: async function (req) {
      let age, duplicate, errorMesssage, errorCode = 400
      if (!req.body.age) errorMesssage = 'age empty'
      else if (!req.body.username) errorMesssage = 'username empty'
      else if (!req.body.password) errorMesssage = 'password empty'
      else {
        try {
          age = parseInt(req.body.age, 10)
          duplicate = await this.sqlQuery('SELECT username FROM userlist WHERE username=?', [req.body.username])
          if (isNaN(age)) errorMesssage = 'age must be a number'
          else if(age < 0) errorMesssage = 'age cannot be negative'
          else if (duplicate.length > 0) errorMesssage = 'duplicate username'
        } catch (error) {
          errorMesssage = error.message, errorCode = 500
        }
      }
      return [errorMesssage, age, errorCode]
    }
  }
}