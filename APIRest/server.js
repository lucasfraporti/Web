const restify = require("restify");
const errors = require("restify-errors");

const servidor = restify.createServer({
    name: "Rest",
    version: "1.0.0"
});

servidor.use(restify.plugins.acceptParser(servidor.acceptable));
servidor.use(restify.plugins.queryParser());
servidor.use(restify.plugins.bodyParser());

servidor.listen(8001, function(){
    console.log("%s executando em http://localhost:8001", servidor.name);
});

var knex = require("knex")({
    client: "mysql",
    connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "rest"
    }
});

servidor.get("/", (req, res, next) => {
    res.send("Olá, amigo!")
});

// Mostra todos os usuários!
servidor.get("/users", (req, res, next) => {
    knex("users").then((dados) => {
        res.send(dados)
    }, next);
});

// Mostra somente o usuário do ID que você quer!
servidor.get("/users/:id", (req, res, next) => {
    const iduser = req.params.id;
    knex("users")
        .where("id", iduser)
        .first()
        .then((dados) => {
            if(!dados){
                return res.send(errors.BadRequestError("Usuário não encontrado!"))
            }
        }, next);
});

// Adiciona um usuário!
servidor.post("/adicionar", (req, res, next) => {
    knex("users")
        .insert(req.body)
        .then((dados) => {
            res.send(dados)
        }, next);
});