var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.Article.find()
        .then(function(data) {
            res.render("index", { articles: data });
        }).catch(function(err) {
            res.json(err);
        })
    });

    app.get("/saved", function(req, res) {
        db.Article.find({ saved: true })
        .then(function(data) {
            res.render("saved", { articles: data });
        })
    });
};