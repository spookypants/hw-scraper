var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");

var PORT = 3000;

// require models
var db = require("./models");

// initialize express
var app = express();

// middleware
// parse body as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public a static folder
app.use(express.static("public"));

// connect to mongo db
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


//function to scrape pcmag desktop reviews and get title, URL
app.get("/scrape", function(req, res) {
    axios.get("https://www.pcmag.com/reviews/desktops").then(function(response) {
        var $ = cheerio.load(response.data);
        var result = {};

        $("div.review-deck").each(function(i, element){
            var title = $(element).find("a").text().trim();
            var link = $(element).find("a").attr("href");
            var description = $(element).find("p.bottom-line-desktop").text().trim();

            result.push({
                title: title,
                link: link,
                description: description
            });
            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });
        res.send("Scrape complete");
    });
});
// ROUTES
//route to list all scraped headlines
app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});
//route to save an article
app.post("/save", function(req, res) {
    db.Article.create()
})
//route to list all saved articles

//route to save a note on a saved article

//route to delete a note

//route to unsave a note


//start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});