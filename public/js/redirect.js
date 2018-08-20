$(function () {
    if (sessionStorage.getItem('token')) {
        $.ajax({
            method: 'GET',
            url: '/group',
            headers: {
                token: sessionStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log('rendering');
                $('body').html(response);
            })
            .fail(function () {
                window.location.replace(window.location.host + '/login');
            })
    }
    else {
        window.location.replace(window.location.host + '/login');
    }
});