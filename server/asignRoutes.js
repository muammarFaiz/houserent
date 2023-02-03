module.exports = function signRoutes(app, myLogic, passport) {
  app.use(myLogic.gatekeeper)

  app.route('/')
    .all(myLogic.homepage_allreq)
    .get(myLogic.getHome)

  app.route('/register')
    .get(myLogic.goHomeIfLogged, (req, res) => {
      res.render('register', {info: {}})
    })
    .post(myLogic.postRegister)

  app.route('/login')
    .get(myLogic.goHomeIfLogged, (req, res) => {
      res.render('login', {info: {}})
    })
    .post(passport.authenticate('local', { failureRedirect: '/loginfail', successRedirect: '/' }))
  // using this hack, it makes the passport not asign a cookie, so avoid using this.
  // .post((req, res, next) => {
  //   passport.authenticate('local', (err, user, info) => {
  //     if(err) res.send(err)
  //     else if(!user) res.render('login', {info: {fail: true}})
  //     else res.redirect('/home')
  //   })(req, res, next)
  // })

  app.route('/loginfail')
    .get((req, res) => {
      res.render('login', { info: { fail: true } })
    })

  app.route('/logout')
    .get((req, res) => {
      req.logout((err) => {
        if (err) {
          console.log(err)
          res.send('log out error...try again later')
        } else res.redirect('/')
      })
    })

  app.route('/inserthotels')
    .get(myLogic.insertHotels)

  // app.route('/search')
  //   .get(function(req, res) {
  //     console.log(req.query)
  //     console.log(req.body)
  //     res.redirect('/')
  //   })
  
  app.route('/profile')
    .get(myLogic.goHomeIfNotLogged, function(req, res) {
      res.render('profile', {info: {login: req.loginBool}})
    })

  app.route('/house/:index')
    .get(myLogic.housepage)
}