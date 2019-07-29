postArticles();

// scrape button
$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).then(function(data) {
        // console.log(data)
        postArticles();
    });
});

// save article
$(".save").on("click", function() {
    $.ajax({
        method: "POST",
        url: "/saved/" + $(this)[0].dataset.id
    });
});

function postArticles(){
    $.ajax({
        method: "GET",
        url: "/articles"
    }).done(function(data) {
        console.log("Data: " + data);
        $("#articleList)").empty();
        if (data.length === 0){
            $("#articleList").append(
                `
                <div className="row">
                    <h5>No Articles to Display!</h5>
                    <p>Click 'Scrape Articles' to load new compuder articles.</p>
                </div>
                `
            )
        } else {
            for (var i = 0; i < data.length; i++) {
                $("#articleList").append(
                    `
                    <div className="row">
                        <h5>${data[i].title}</h5>
                        <p>${data[i].description}</p>
                        <a target="_blank" href="${data[i].link}">See More</a>
                        <a data-id="${data[i]._id}" href="#" class="save">Save Article</a>
                    </div>
                    `
                );
            };
        };
    });
};