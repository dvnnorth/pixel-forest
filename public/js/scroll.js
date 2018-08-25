
$(document).on("scroll", function () {
    if ($(document).scrollTop() > 100) {
        $(".navbar").addClass("activeNavbar");
        $('.bg').addClass('show');
    } else {
        $(".navbar").removeClass("activeNavbar");
        $('.bg').removeClass('show');
    };
});