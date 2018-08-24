$(function () {

    var loginEndpoint = window.location.protocol + '//' + window.location.host + '/login';
    if (sessionStorage.getItem('token')) {
        $.ajax({
            method: 'GET',
            url: '/api/profile/content',
            async: true,
            headers: {
                token: sessionStorage.getItem('token'),
                id: sessionStorage.getItem('id')
            }
        })
            .then(function (content) {

                // Render images here


                console.log(content);
                content.forEach(function (post) {
                    // This builds the images with a close button that will delete each image when clicked
                    // On click event for deleting above. Use data-deleteid attribute of button
                    var newImg = $('<img>')
                        .attr('src', post.pictureUrl)
                        .attr('data-photoid', post.id)
                        .attr('width', 260)
                        .attr('height', 260)
                    $("#postsDiv").append(newImg);
                });
            })
            .fail(function () {
                window.location.replace(loginEndpoint);
            });
    }
    else {
        window.location.replace(loginEndpoint);
    }
});