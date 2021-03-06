const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const session = require('express-session');
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController')
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./user/User');
const userController = require('./user/UserController');
const adminAuth = require('./midlewares/adminAuth');

//view engine
app.set('view engine', 'ejs');

//Sessions
app.use(session({
    secret: "coisa",
    cookie: {maxAge: 3600000}
}))

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//static
app.use(express.static('public'));
//database
connection.authenticate().then(() => {
    console.log("Db connection succesfull")
}).catch((error) =>{
    console.log(error);
})
//Rotas de controller
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);

app.get("/", (req, res) =>{
    Article.findAll({
        order:[
            ['id', 'DESC']
        ]
    }).then(articles =>{
        Category.findAll().then(categories =>{
            res.render('index.ejs', {articles: articles, categories: categories});
        })
        
    })
    
})

app.get("/:slug", (req, res) =>{
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render('article.ejs', {article: article, categories: categories});
            })
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    })
})

app.get("/category/:slug", (req, res) =>{
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug:slug
        },
        include:[{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    })
})

app.listen(8080, () =>{
    console.log("The server is running");
})