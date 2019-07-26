var express = require("express"); // express
var logger = require("morgan"); // morgan
var mongoose = require("mongoose"); //mongoose
// var bodyParser = require("body-parser"); // body parser
var cheerio = require("cheerio"); // cheerio
var axios = require("axios"); // axios

var PORT = process.env.PORT || 3000;

// require models
var db = require("./models");

// initialize express
var app = express();

// middleware
app.use(logger("dev"));
// parse body as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public a static folder
app.use(express.static("public"));

//body parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// handlebars
var exphbs = require("express-handlebars"); // express handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// connect to mongo db
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// var db = mongoose.connection;

// db.on("error", function(error) {
//     console.log("Mongoose error: ", error);
// });

// db.once("open", function() {
//     console.log("Mongoose connection successful.");
// });

//function to scrape pcmag desktop reviews and get title, URL
// app.get("/scrape", function(req, res) {
//     var returnData = [];
//     axios.get("https://www.pcmag.com/reviews/desktops").then(function(response) {
//         var $ = cheerio.load(response.data);
//         var result = {};

//         $("div.review-deck").each(function(i, element){

//             result.title = $(element).find("a").text().trim();
//             result.description = $(element).find("p.bottom-line-desktop").text().trim();
//             result.link = $(element).find("a").attr("href");
//             result.saved = false;
//             // result.push({
//             //     title: title,
//             //     link: link,
//             //     description: description,
//             //     saved: false
//             // });
//             db.Article.create(result)
//             .then(function(dbArticle) {
//                 // console.log(dbArticle);
//                 returnData.push(result);
//             })
//             .catch(function(err) {
//                 console.log(err);
//             });
//         });
//         res.send("Scrape complete");
//     });
// });

//route to list all scraped articles
// app.get("/articles", function(req, res) {
//     db.Article.find({ saved: false })
//     .then(function(dbArticle) {
//         var hbsObj = {
//             articles: dbArticle
//         };
//         res.render("index", hbsObj);
//     })
//     .catch(function(err) {
//         res.json(err);
//     });
// });

//route to save an article
// app.post("/save/:id", function(req, res) {
//     db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: { saved: true }}, { new: true })
//     .then(function(err, dbArticle) {
//         if (err) {
//             console.log(err);
//             // res.status(200).send();
//         } else {
//             res.json(dbArticle);
//         }
//     });
// });

// route to unsave an article
// app.post("/unsave/:id", function(req, res) {
//     db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: { saved: false }})
//     .then(function(err, dbArticle) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(dbArticle);
//         }
//     });
// });

// route to list all saved articles
// app.get("/saved", function(req, res) {
//     db.Article.find({ saved: true })
//     .then(function(dbArticle) {
//         var hbsObj = {
//             articles: dbArticle
//         };
//         res.render("saved", hbsObj);
//     })
//     .catch(function(err) {
//         res.json(err);
//     });
// });

// route to see all notes
// app.get("/getNotes/:id", function(req, res) {
//     db.Article.findOne({ _id: req.params.id })
//     .populate("note")
//     .then(function(dbArticle) {
//         res.json(dbArticle);
//     }).catch(function(err) {
//         res.json(err);
//     });
// });

// route to save a note on a saved article
// app.post("/createNote/:id", function(req, res) {
//     db.Note.create(req.body).then(function(dbNote) {
//         return db.Article.findOneAndUpdate(
//             { _id: req.params.id }, 
//             {note: dbNote._id},
//             { new: true }
//             );
//     }).then(function(dbArticle) {
//         res.json(dbArticle);
//     }).catch(function(err) {
//         res.json(err);
//     });
// });

require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);

//start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});