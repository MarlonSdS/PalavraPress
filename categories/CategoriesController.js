const Express = require("express");
const router = Express.Router();
const Category = require('./Category');
const Slugify = require('slugify');

router.get("/categories", (req, res) =>{
    res.send("Rota categorias")
})

router.get("/categories/admin/new", (req, res) =>{
    res.send("Criar uma nova categoria")
})

router.get("/admin/categories/new", (req, res) =>{
    res.render('admin/categories/new')
})

router.post("/categories/save", (req, res) =>{
    var title = req.body.title;
    if(title == undefined){
        res.redirect("/admin/categories/new");
    }else{
        Category.create({
            title: title,
            slug: Slugify(title)
        }).then(() => {
            res.redirect("/")
        })
    }
})

module.exports = router;