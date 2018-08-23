$(function () {
    $(document).on("scroll", function () {
        if ($(document).scrollTop() > 100) {
            $(".navbar").addClass("activeNavbar");
            $('.bg').addClass('show');
        } else {
            $(".navbar").removeClass("activeNavbar");
            $('.bg').removeClass('show');
        }
    });

    $('#signUpSubmit').on('click', function (event) {
        event.preventDefault();
        // MAKE SURE TO PERFORM VALIDATION! Firebase is lenient!
        var userInfo = {
            firstName: $('#firstName').val().trim(),
            lastName: $('#lastName').val().trim(),
            email: $('#inputEmail').val().trim(),
            password: $('#inputPassword').val().trim()
        }
        submitUserPass('/login/signup', userInfo);
    });

    $('#signInSubmit').on('click', function (event) {
        event.preventDefault();
        // MAKE SURE TO PERFORM VALIDATION! Firebase is lenient!
        var userInfo = {
            email: $('#inputEmail').val().trim(),
            password: $('#inputPassword').val().trim()
        }
        submitUserPass('/login', userInfo);
    });

    function submitUserPass(endpoint, data) {
        $.post(endpoint, data, function (userInfo) {
            sessionStorage.setItem('token', userInfo.token);
            sessionStorage.setItem('id', userInfo.id);
            window.location.replace('/profile');
        })
            .fail(function (response) {
                loginError(response);
            });
    }

    function loginError(response) {
        $("#errorMessage").text(response.responseJSON.message);
        $("#errorBlock").removeClass("d-none");
    }
});