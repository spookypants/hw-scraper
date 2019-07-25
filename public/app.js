// scrape button
$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).then(function(data) {
        console.log(data)
        window.location = "/"
    })
});

// active nav click
$(".navbar-nav li").on("click", function() {
    $(".navbar-nav li").removeClass("active");
    $(this).addClass("active");
});

// save article
$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/saved/" + thisId
    }).then(function(data) {
        window.location = "/"
    })
});

// delete article
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/saved/" + thisId
    }).then(function(data) {
        window.location = "/saved"
    })
});

//save note
$(".saveNote").on("click", function() {
    var thisId = $(this).attr("data-id");
    if (!$("#noteText" + thisId).val()) {
        alert("Please enter a note to save!");
    } else {
        $.ajax({
            method: "POST",
            url: "/notes/saved/" + thisId,
            data: {
                text: $("#noteText" + thisId).val()
            }
        }).then(function(data) {
            console.log(data);
            $("#noteText" + thisId).val("");
            $(".modalNote").modal("hide");
            window.location = "/saved"
        });
    }
});

//delete note
$(".deleteNote").on("click", function() {
    var noteId = $(this).attr("data-note-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/saved/" + noteId + "/" + articleId
    }).then(function(data) {
        console.log(data);
        $(".modalNote").modal("hide");
        window.location = "/saved"
    })
});