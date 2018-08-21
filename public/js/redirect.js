$(function () {
    let loginEndpoint = window.location.protocol + '//' + window.location.host + '/login';
    if (sessionStorage.getItem('token')) {
        $.ajax({
            method: 'GET',
            url: '/group',
            async: true,
            headers: {
                token: sessionStorage.getItem('token')
            }
        })
            .then(function (response) {
                document.body.innerHTML = response;
            })
            .fail(function () {
                window.location.replace(loginEndpoint);
            })
    }
    else {
        window.location.replace(loginEndpoint);
    }
});