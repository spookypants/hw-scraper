var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    // when scrape
    app.get("/scrape", function(req, res) {
        axios.get("https://www.pcmag.com/reviews/desktops").then(function(response) {
            var $ = cheerio.load(response.data);

            $("div.review-deck").each(function(i, element) {
                var result = {};

                result.title = $(element).find("a").text().trim();
                result.description = $(element).find("p.bottom-line-desktop").text();
                result.link = $(element).find("a").attr("href");
                result.saved = false;

                var article = db.Article(result);
                db.Article.create(article).then(function(data) {
                    console.log(data);
                }).catch(function(err) {
                    console.log(err);
                });
            });
            res.send("Scrape complete!");
        });
    });

    // fetch all articles
    app.get("/articles", function(req, res) {
        db.Article.find({}).then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // save article
    app.put("/articles/:id", function(req, res) {
        db.Article.update({ _id: req.params.id }, { $set: { saved: true }})
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // unsave article
    app.put("/articles/:id", function(req, res) {
        db.Article.update({ _id: req.params.id }, { $set: { saved: false }})
        .then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // fetch specific article
    app.get("/articles/:id", function(req, res) {
        db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(data) {
            res.json(data);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // add note
    app.post("/articles/:id", function(req, res) {
        var note = new db.Note(req.body);
        db.Note.create(note).then(function(data) {
            db.Article.findOneAndUpdate(
                { _id: req.params.id}, 
                { $push: { "note": data._id }}, 
                { new: true })
            .then(function(data) {
                res.json(data);
            }).catch(function(err) {
                res.json(err);
            });
        });
    });
};