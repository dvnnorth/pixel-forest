$(function () {
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
                window.location.replace(window.location.host + '/login');
            })
    }
    else {
        window.location.replace(window.location.host + '/login');
    }
});