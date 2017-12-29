$(document).ready(function(){
  $('.save').each(function(index) {
    $(this).on("click", function(){
        data = {
          title: $(this).parent('div').prev().children('h4').text(),
          articleSnippet:$(this).prev().prev().children('p').text(),
          link: $(this).prev().prev().attr("href")
        }
        $.ajax({
          method:"POST",
          url: "/save",
          data: data,
          success: function(res) {
          }
        })
            alert('Article saved')
    })
})

});
  


