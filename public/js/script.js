$(function () {
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
        $.post(endpoint, userInfo, function (data) {
            console.log("success");
            console.log(JSON.parse(data));
        })
            .fail(function (response) {
                $("#errorMessage").text(response.responseJSON.message);
                $("#errorBlock").removeClass("d-none");
            });
    }
});