// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='card' data-_id='" 
      + data[i]._id + "'>" 
      + "<div class='card-header'><h3><a class='article-link' target='_blank' href='" 
      + data[i].link + "'>" 
      + data[i].title + "</a><a class='btn btn-success save'>Save Article</a></h3></div>"
      + "<div class='card-body'>" + data[i].description + "</div></div>"
      );
    }
  });