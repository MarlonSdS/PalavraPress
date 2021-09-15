const Express = require("express");
const router = Express.Router();
const Category = require('./Category');
const Slugify = require('slugify');
const { default: slugify } = require("slugify");

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
            res.redirect("/admin/categories")
        })
    }
})

router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            })
        }else{
            res.redirect("/admin/categories");
        }
    }else{
        res.redirect("/admin/categories");
    }
    
})



router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    })

    
})


router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(category =>{
        if(category != undefined){
            res.render("admin/categories/edit", {category: category});
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro =>{
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: Slugify(title)}, {
        where:{
            id: id
        }
        }).then(() => {
            res.redirect("/admin/categories")
    })
})

module.exports = router;