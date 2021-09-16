const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController')
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const favicon = require('serve-favicon');

//favicon
app.use(favicon(__dirname + '/public/icon.png'));

//view engine
app.set('view engine', 'ejs');
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

app.get("/", (req, res) =>{
    Article.findAll({
        order:[
            ['id', 'DESC']
        ]
    }).then(articles =>{
        res.render('index.ejs', {articles: articles});
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
            res.render("article", {article: article});
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    })
})

app.listen(8080, () =>{
    console.log("The server is running");
})