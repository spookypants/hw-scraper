// scrape button
$(".scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).then(function(data) {
        console.log(data)
        window.location.replace = "/"
    });
});

$(".home").on("click", function() {
    $.get("/", function(req, res) {
        console.log(res);
    }).then(function(data) {
        window.location.replace = "/";
    });
});

// active nav click
// $(".navbar-nav li").on("click", function() {
//     $(".navbar-nav li").removeClass("active");
//     $(this).addClass("active");
// });

// save article
$(".save").on("click", function() {
    $(this).parent().remove();
    var articleId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/save/" + articleId
    }).then(function(data) {
        $(".article").filter("[data-id='" + articleId + "']").remove();
    });
});

// view saved article
$(".saved").on("click", function() {
    $.get("/saved", function(req, res) {
        console.log(res);
    }).then(function(data) {
        window.location.replace = "/saved";
    });
});

// delete article
$(".unsave").on("click", function() {
    $(this).parent().remove();
    var articleId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/unsave/" + articleId
    }).then(function(data) {
        $(".article").filter("[data-id='" + articleId + "']").remove();
    });
});

// open and view notes
$(".addNote").on("click", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    if (!$("#noteText" + thisId).val()) {
        alert("Please enter a note to save!");
    } else {
        $.ajax({
            method: "POST",
            url: "/getNotes/" + thisId
        }).then(function(data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<h3 id='notestitle'></h3>");
            $("#notes").append("<p id='notesbody'></p>");
            $("#notes").append("<div class='form-group'><label for='title'>Title: </label><input id='titleinput' class='form-control' name='title'></div>");
            $("#notes").append("<div class='form-group'>label for='body'>Note: </label><input id='bodyinput' class='form-control' name='body'></div>");
            $("#notes").append("<button class='btn btn-default' data-id='" + data._id + "' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#notestitle").text(data.note.title);
                $("#notesbody").text(data.note.body);
            }
        });
        $('#noteModal').modal();
    }
});

//save note
$("#savenote").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/createNote/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function(data) {
        console.log(data);
        $("#notes").empty();
    });
    $("#titleinput").val("");
    $("#bodyinput").val("");
    $("#noteModal").val("");
});

// $(".deleteNote").on("click", function() {
//     var noteId = $(this).attr("data-note-id");
//     var articleId = $(this).attr("data-article-id");
//     $.ajax({
//         method: "DELETE",
//         url: "/notes/saved/" + noteId + "/" + articleId
//     }).then(function(data) {
//         console.log(data);
//         $(".modalNote").modal("hide");
//         window.location = "/saved"
//     })
// });