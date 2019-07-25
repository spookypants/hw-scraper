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

// handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// connect to mongo db
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//handlebars
app.get("/", function(req, res) {
    db.Article.find({ "saved": false }, function(error, data) {
        var hbsObj = {
            article: data
        };
        console.log(hbsObj);
        res.render("home", hbsObj);
    });
});

app.get("/saved", function(req, res) {
    db.Article.find({ "saved": true })
    .populate("notes")
    .then(function(error, articles) {
        var hbsObj = {
            article: articles
        };
        res.render("saved", hbsObj);
    });
});


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
app.post("/articles/saved/:id", function(req, res) {
    db.Article.create({ "_id": req.params.id }, { "saved": true })
    .then(function(err, dbArticle) {
        if (err) {
            console.log(err);
        } else {
            res.send(dbArticle);
        }
    });
});

//route to list all saved articles
app.get("/saved", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//route to save a note on a saved article
app.post("/saved/:id", function(req, res) {
    db.Note.create(req.body).then(function(dbNote) {
        return db.Article.findOneAndUpdate(
            { _id: req.params.id }, 
            { $push: {note: dbNote._id} },
            { new: true }
            )
    }).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

//route to delete an article
app.delete("/articles/saved/:id", function(req, res) {
    db.Article.findOneAndDelete({ "_id": req.params.id }, { "saved": false, "notes": []})
    .then(function(err, dbArticle) {
        if (err) {
            console.log(err);
        } else {
            res.json(dbArticle);
        }
    });
});

//route to unsave a note


//start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});