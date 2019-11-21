var lastScrollTop = 0;
$(document).scroll(function() {
    var y = $(this).scrollTop();
    // if i'm scrolling to the top after 1000px
    if (y > 667 && y < lastScrollTop) { 
        $('#toTop').fadeIn();
    } else {
        $('#toTop').fadeOut();
    }
    lastScrollTop = y;
});
$('#toTop').on('click',function(){
    $('html, body').animate({scrollTop: '0px'}, 300);
});