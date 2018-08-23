$(function () {
    let loginEndpoint = window.location.protocol + '//' + window.location.host + '/login';
    if (sessionStorage.getItem('token')) {
        $.ajax({
            method: 'GET',
            url: '/profile',
            async: true,
            headers: {
                token: sessionStorage.getItem('token'),
                id: sessionStorage.getItem('id')
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