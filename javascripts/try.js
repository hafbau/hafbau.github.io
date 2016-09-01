$(function() {

  function bindEvents() {

    $(".main-nav li").on("click", "a", function(e) {
      e.preventDefault();

      $(".main-nav-active").removeClass("main-nav-active");
      $(this).addClass("main-nav-active");

      id = $(e.target).attr("href");
      $current = $("main:visible")
      $current.hide();
      $(id).show();

      localStorage.setItem("active", id);

    });
    
    $(".cards-container").on("click", ".card", function(e) {
      e.preventDefault();
      
      $("#slides").html(e.target);
      $("#detail").show();
    })
  };

  function getStoredActive() {
    return localStorage.getItem("active");
  }


  bindEvents();
  $("[href=" + getStoredActive() + "]").trigger("click");
  
})
