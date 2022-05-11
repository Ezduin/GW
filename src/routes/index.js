const router = require('express').Router()

router.get('/',(req,res,next) => {
    res.render('index')
})

router.get('/inventario',(req,res,next) => {
    res.render('inventario')
})



module.exports = router
