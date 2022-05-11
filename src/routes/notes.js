const { create} = require('express-handlebars')
const router = require('express').Router()
const Note = require("../models/Note")
const {isAuthenticated} = require('../helpers/auth')


router.get('/',(req,res,next) => {
    res.send('Index')
})

router.get('/notes', isAuthenticated, async (req,res,next) => {
  const notes = await Note.find({user: req.user.id}).sort({date: 'desc'})
  res.render('notes/list', { notes })
})


router.get("/notes/add",isAuthenticated, (req,res) =>{
    res.render("notes/add")
})

router.post("/notes/add", isAuthenticated, async (req,res) =>{
   const{title, description, price, quantity}=req.body
   const errors = []
   if(!title){
    errors.push({text: "escriba algo, por favor!!!!"})
   }
   if(!description){
       errors.push({text:"escriba la descripcion"})
   }
   if(errors.length > 0){
       res.render("notes/add",{ 
       errors,
       title,
       description,
       price,
    quantity})
   } else{
        const newNote = new Note({
            title,
            description,
            price,
            quantity
        })
        newNote.user = req.user.id
       const newN = await newNote.save()
       if(newN){
           
        req.flash("suc", "Producto agregado sastifactoriamente")
        res.redirect("/notes")
       
       
       }else{
        req.flash("error", "Error no se pudo guardar el producto")
        res.redirect("/notes")
       }
 
   }

})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
   const note = await Note.findById(req.params.id)
   res.render('notes/edit',{note})
})

router.put('/notes/edit/:id',isAuthenticated, async (req, res) =>{

    const {title, description, price, quantity} = req.body
   await  Note.findByIdAndUpdate(req.params.id, {title, description, price,quantity})
   res.redirect('/notes')
})

router.delete('/notes/delete/:id',isAuthenticated, async (req, res) =>{
    await Note.findByIdAndDelete(req.params.id)
    res.redirect('/notes')
})



module.exports = router