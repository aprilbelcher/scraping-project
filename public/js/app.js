$(document).ready(function () {

  //*****Save Article Button*****//
  $('.save').each(function (index) {
    $(this).on("click", function () {
      data = {
        title: $(this).parent('div').prev().children('h4').text(),
        articleSnippet: $(this).prev().prev().children('p').text(),
        link: $(this).prev().prev().attr("href")
      };
      $.ajax({
        method: "POST",
        url: "/save",
        data: data,
        success: function (res) {}
      });
      alert('Article saved');
    });
  });

  //*****Delete Article Button*****//
  $('.delete-article').each(function (index) {
    $(this).on("click", function () {
      data = {
        id: $(this).attr('id')
      };
      console.log(data);
      $.ajax({
        method: "DELETE",
        url: "/article/" + data.id,
        success: function (res) {}
      });
      alert('Article deleted');
      location.reload();
    });
  });

  //*****Delete Comment Button*****//
  $('.delete-button').on('click', function (e) {
    e.preventDefault();
    var qURL = location.href + '/' + $(this).data('comment');
    $.ajax({
      method: "DELETE",
      url: qURL
    });
    location.reload();
  });

});