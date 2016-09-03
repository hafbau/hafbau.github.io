$(function() {
  var say = console.log,
      all_posts = [],
      templates = {};

  $("script[type='text/x-handlebars']").each(function() {
    var $tmpl = $(this);
    templates[$tmpl.attr("id")] = Handlebars.compile($tmpl.html());
  });

  $("[data-type=partial]").each(function() {
    var $partial = $(this);
    Handlebars.registerPartial($partial.attr("id"), $partial.html());
  });

  Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

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
      $this_card = $(e.target).closest(".card")
      $("#slides").html($this_card[0].outerHTML);
      var this_id = +$this_card.attr("data-id");
      $("#comments ul").html(templates.comments({comments: all_posts[this_id].comments}));
      $("#detail").show();
      $("body").css("overflow", "hidden");
    });

    $("#detail").on("click", function(e) {
      e.preventDefault();
      var clicked = e.target;

      (this === clicked || clicked === $(".close")[0]) && $(this).hide() && $("body").css("overflow", "scroll");
    });

    $(".next").on("click", function(e) {
      e.preventDefault();
      var next_id = +$("#slides .card").attr("data-id") + 1 + "";
      var $next_card = $(".cards-container [data-id=" + next_id + "]");

      if (!$next_card.length) {
        $next_card = $(".cards-container .card").first();
      };
      $("#slides").html($next_card[0].outerHTML);
      $("#comments ul").html(templates.comments({comments: all_posts[+next_id].comments}));
    });

    $(".prev").on("click", function(e) {
      e.preventDefault();
      var prev_id = +$("#slides .card").attr("data-id") - 1 + "";
      var $prev_card = $(".cards-container [data-id=" + prev_id + "]");

      if (!$prev_card.length) {
        $prev_card = $(".cards-container .card").last();
      };
      $("#slides").html($prev_card[0].outerHTML);
      $("#comments ul").html(templates.comments({comments: all_posts[+prev_id].comments}));
    });

  };

  function makePost() {
    var post = makeComment(all_posts),
        media = { video: _(["https://www.youtube.com/watch?v=ScMzIvxBSi4",
                        "https://www.youtube.com/watch?v=OCWj5xgu5Ng",
                        "https://www.youtube.com/watch?v=XQu8TTBmGhA",
                        "https://www.youtube.com/watch?v=jIHvgUAW5vE",
                        "https://www.youtube.com/watch?v=Ypgt-m4WY5o"]).sample(),
                      img: "http://mdbootstrap.com/images/regular/nature/img%20(" +
                           Math.floor(Math.random()*83) + ").jpg"
                    };
    post.media_type = _(["img", "video", undefined]).sample();
    post.media_src = !!post.media_type && media[post.media_type];
    post.ptext = !comment.media_type ? chance.paragraph() : chance.bool() && chance.paragraph();
    post.audience = _(["Friends", "Public"]).sample();
    post.comments = [];

    post.comments_count = chance.natural({min: 50, max: 1500});
    for (var i = post.comments_count; i > post.comments.length; i--) {
      post.comments.push(makeComment(post.comments));
    };
    return post;
  }

  function makeComment(all_comments) {
    var seconds = all_comments.length ? _(all_comments).last().seconds - chance.second() : -chance.second(),
        media = {};

    var comment = {
      id: all_comments.length,
      fname: chance.first(),
      lname: chance.last(),
      ptime: moment.duration(this.seconds, "seconds").humanize(),
      avatar: chance.avatar(),
      location: chance.city(),
      share: chance.natural({min: 0, max: 99}),
      favourite: chance.natural({min: 0, max: 99})
    };

    comment.ptext = chance.paragraph();

    return comment;
  }

  var posts_count = chance.natural({min: 205, max: 905});
    for (var i = posts_count; i > all_posts.length; i--) {
      all_posts.push(makePost());
    };

  $(".cards-container").html(templates.posts({posts: all_posts}));

  function getStoredActive() {
    return localStorage.getItem("active");
  }

  bindEvents();
  $("[href=" + getStoredActive() + "]").trigger("click");
  
})
