const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController')
const Article = require('./articles/Article');
const Category = require('./categories/Category');

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
    res.render('index.ejs');
})

app.listen(8080, () =>{
    console.log("The server is running");
})