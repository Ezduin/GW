const router = require('express').Router()
const User = require("../models/User")

const passport = require("passport")

router.get('/users/signup',(req,res,next) => {
    res.render('users/signup')
})

router.post('/users/signup', async (req,res,next) => {
    const {name, email, password, confirmPassword} = req.body
    const errors= []
    if(name.length <=0){
        errors.push({text: "ingresa su nombre"})
    }

    if(email.length <=0){
        errors.push({text: "ingresa su correo"})
    }

    if(password.length <=0){
        errors.push({text: "ingresa su contraseña"})
    }
    if(confirmPassword.length <=0){
        errors.push({text: "ingrese de nuevo su contraseña"})
    }
    if(password.length < 4 || password.length >= 15){
        errors.push({text: "la contraseña debe contener al menos 4 caracteres y no mas de 15"})
    }
    if(password != confirmPassword){
        errors.push({text: "Las contraseñas no son iguales"})
    }
    if(errors.length>0){
        res.render('users/signup', {errors, name, email, password, confirmPassword})
    }else{
        const userEmail = await User.findOne({ email: email})
        if(userEmail){
          req.flash("error", "El email ya existe")
          return res.redirect("/users/signup")
        
        }
        const newUser = new User({name, email, password})
        newUser.password = await newUser.encryptPassword(password)
      await  newUser.save()
      req.flash("suc", "Registrado sastifactoriamente")
      res.redirect("/users/signin")
    }
   
})

router.get('/users/signin',(req,res,next) => {
    res.render('users/Signin')
})

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/logout', (req, res) =>{

        req.logout()
        res.redirect('/')
})

module.exports = router