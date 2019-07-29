postSavedArticles();

function postSavedArticles() {
    $.ajax({
        method: "GET",
        url: "/articles/saved"
    }).done(function(data) {
        $("#articleList").empty();
        if (data.length === 0) {
            $("#articleList").append(
                `
                <div class="row">
                <h5>No Articles to Display!</h5>
                <p>Save an Article from the main page!</p>
                </div>
                `
            )
        } else {
            for (var i = 0; i < data.length; i++) {
                $("#articleList").append(
                    `
                    <div class="row">
                        <h5>${data[i].title}</h5>
                        <p>${data[i].description}</p>
                        <a href="#" class="addNote">Notes</a>
                        <a data-id="${data[i]._id}" href="#" class="unsave">Remove Article</a>
                    </div>
                    `
                );
            };
        };
    });
};

$(".unsave").on("click", function(req, res) {
    $.ajax({
        method: "POST",
        url: "/saved/remove/" + $(this)[0].dataset.id
    });
    $(`#$($(this)[0].dataset.id)`).remove();
});

$(".addNote").on("click", function() {
    $("#noteText").attr("data-id", $(this).offsetParent()[0].id);
    $.ajax({
        method: "GET",
        url: "/articles/" + $(this).offsetParent()[0].id,
    }).done(function(data) {
        if(data.notes.length > 0) {
            $("#modalTitle").text("Saved Notes: " + data.notes.length);
        } else {
            $("#modalTitle").text("Saved Notes: No saved notes yet!");
        }
        $("#noteModal").modal("show");
    });
});

$("#saveNote").on("click", function() {
    $.ajax({
        method: "POST",
        url: "/note/" + $("#noteText").attr("data-id"),
        data: {
            body: $("#noteText").val()
        }
    })
    .then(function(data) {
        console.log("Note saved: " + data);
    });
});