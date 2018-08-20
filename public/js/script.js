$(function () {
    $(document).on("scroll", function(){
        if ($(document).scrollTop() > 100) {
          $(".navbar").addClass("activeNavbar");
          $('.bg').addClass('show');
        } else {
          $(".navbar").removeClass("activeNavbar");
          $('.bg').removeClass('show');	
        }
    });

    $('#signUpSubmit').click(function (event) {
        event.preventDefault();
        submitUserPass('/login/signup');
    });

    $('#signInSubmit').click(function (event) {
        event.preventDefault();
        submitUserPass('/login');
    });

    function submitUserPass(endpoint) {
        // MAKE SURE TO PERFORM VALIDATION! Firebase is lenient!
        var userInfo = {
            email: $('#inputEmail').val().trim(),
            password: $('#inputPassword').val().trim()
        }
        $.post(endpoint, userInfo, function (token) {
            console.log('setting token');
            sessionStorage.setItem('token', token);
            console.log('redirecting');
            window.location.replace('/group');
        })
            .fail(function (response) {
                console.log('catching an error');
                loginError(response);
            });
    }

    function loginError(response) {
        $("#errorMessage").text(response.responseJSON.message);
        $("#errorBlock").removeClass("d-none");
    }
});