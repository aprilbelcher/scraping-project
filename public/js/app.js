$(document).ready(function(){
  $('.save').on('click', function(e) {
    currentUrl = window.location.origin
    data = {
      title: $('#title').text(),
      articleSnippet: $('#snippet').text(),
      link: $("#link").attr("href")
    }
    console.log(data);
    $.ajax({
      method:"POST",
      url: "/save",
      data: data
    })
    .done(function(article) { 
      alert("article saved");
      });
    
  });
});
  


