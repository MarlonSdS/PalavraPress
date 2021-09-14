const Express = require("express");
const router = Express.Router();

router.get("/articles", (req, res) =>{
    res.send("Rota articles")
})

router.get("/articles/admin/new", (req, res) =>{
    res.send("Criar uma nova categoria")
})

module.exports = router;