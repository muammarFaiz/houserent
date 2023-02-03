module.exports = function routeLogic(tools) {
  return {
    gatekeeper: function (req, res, next) {
      console.log(req.originalUrl)
      console.log(req.session)
      console.log(req.user)

      req.loginStatus = 'you are not logged in'
      req.loginBool = false
      if (req.isAuthenticated()) {
        req.loginStatus = 'you are logged in'
        req.loginBool = true
      }

      next()
    },
    homepage_allreq: async function (req, res, next) {
      req.rowstart = req.query.rowstart ? Number(req.query.rowstart) : 0

      const query_keys = Object.keys(req.query)
      let filtered_user_keywords = ''
      if (query_keys.length > 0 ? query_keys[0] == 'keyword' : false ) {
        // a user use the searhbar
        // remove all symbols except , and .
        filtered_user_keywords = req.query.keyword.replace(/[!@#$%^&*()_+|={};':"<>?\/\\\[\]\-]/g, '')
        // remove duplicate spaces
        filtered_user_keywords = filtered_user_keywords.replace(/\s+/g, ' ')
        const searched_houses = await tools.sqlQuery(
          `SELECT * FROM houses WHERE owner_name = '${filtered_user_keywords}' OR address = '
          ${filtered_user_keywords}' LIMIT ${req.rowstart}, 10`
        )
        console.log(searched_houses)
        req.searched_houses = searched_houses
        req.filtered_user_keywords = filtered_user_keywords
      }
      next()
    },
    getHome: async function(req, res) {
      if (req.session.visit_count) req.session.visit_count++
      else req.session.visit_count = 1

      let copied, nocardtoshow
      let user_searchbar_context = ''
      if(req.searched_houses) {
        copied = JSON.parse(JSON.stringify(req.searched_houses))
        nocardtoshow = copied.length < 1
        user_searchbar_context = `keyword=${req.filtered_user_keywords}&`
      } else {
        const houses = await tools.sqlQuery(`SELECT * FROM houses LIMIT ${req.rowstart}, 12`)
        copied = JSON.parse(JSON.stringify(houses))
        nocardtoshow = houses.length < 1
      }

      res.render('home', {
        info: {
          login: req.loginBool, houses: copied,
          anchornextpage: `<a href="?${user_searchbar_context}rowstart=${req.rowstart + 12}">`,
          nocardtoshow: nocardtoshow, searchbar_value: req.filtered_user_keywords
        }
      })
    },
    postRegister: async function(req, res) {
      try {
        const [errorText, age, errorCode] = await tools.validateData(req)
        if (errorText) return res.status(errorCode).render('register', { info: { fail: errorText } })

        const { salt: userSalt, hash: userHash } = tools.genPass(req.body.password)
        const result = await tools.sqlQuery(
          'INSERT INTO userlist SET ?',
          { username: req.body.username, age: age, password_hash: userHash, hash_salt: userSalt, created_date: new Date().toLocaleString('sv-SE') }
        )
        if (result.affectedRows === 1) return res.render('login', { info: { fromRegister: true } })
        else if (result.affectedRows < 1) return res.status(500).render('register', {info: {fail: 'fail to register, try again later'}})
        else res.status(500).render('register', {info: {fail: 'something is wrong, try again later'}})
      } catch (error) {
        console.log(error)
        res.status(500).render('register', {info: {fail: error.message}})
      }
    },
    goHomeIfLogged: function(req, res, next) {
      if(req.isAuthenticated()) res.redirect('/')
      else next()
    },
    goHomeIfNotLogged: function(req, res, next) {
      if(req. isAuthenticated()) next()
      else res.redirect('/')
    },
    insertHotels: async function(req, res) {
      // add more hotels at least 20 more
      let dataArr = []
      for(let i = 0; i < 30; i++) {
        dataArr.push(tools.sqlQuery('INSERT INTO houses SET ?', {
          owner_name: 'rudi ver2' + (i + 1), phone: '0888 8888 889' + (i + 1), no_ktp: 1234567890 + i,
          address: 'jalan jalan hehe yuk kota kecamatan rt rw zzzzzzzzzzzzzzzzzzzzzzzzzzz ' + i, rating: i,
          bed_count: i < 6 ? i : i%5, priv_toilet: i%2 < 1
        }))
        // insert the tabel data after you create the tabel
      }
      const results = await Promise.all(dataArr)
      console.log(results)
      // const result = await tools.sqlQuery('INSERT INTO houses SET ?', {
      //   owner_name: 'rudi', phone: 081213871033, no_ktp: 12345678910, address: 'home sweet home heehee', rating: 123,
      //   bed_count: 123, priv_toilet: true
      // })
      console.log(results)
      res.send('ok')
    },
    housepage: async function(req, res) {
      console.log(req.params)
      try {
        const housedata = await tools.sqlQuery('SELECT * FROM houses WHERE house_index = ' + req.params.index)
        console.log(housedata)
        res.render('house', {info: {housedata: housedata[0]}})
      } catch (error) {
        res.render('house', {info: {housedata: {owner_name: 'error nih'}}})
      }
    }
  }
}