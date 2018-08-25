$(function () {

    var loginEndpoint = window.location.protocol + '//' + window.location.host + '/';

    // Sign Out Functionality
    $('#signOut').on('click', function (event) {
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('token');
        window.location.replace(loginEndpoint);
    });

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

                content.forEach(function (post) {
                    // This builds the images with a close button that will delete each image when clicked
                    // On click event for deleting above. Use data-deleteid attribute of button
                    // <a href="#" data-toggle="modal" data-target="#photoModal"><img height="200" width="200" src="https://source.unsplash.com/1600x900/?children,smile" alt="random thumbnail"></a>
                    var newImg = $('<img>')
                        .attr('class', 'profilePhoto')
                        .attr('src', post.pictureUrl)
                        .attr('data-photoid', post.id)
                        .attr('width', 200)
                        .attr('height', 200)
                        .attr('alt', post.title);
                    $("#postsDiv").append(newImg);
                });

                // On Click listener for displaying image modal

                $('.profilePhoto').on('click', function (event) {
                    var $this = $(this);
                    var photoId = $(this).data('photoid');
                    var route = '/api/profile/post/' + photoId;
                    $.ajax({
                        method: 'GET',
                        url: route,
                        async: true,
                        headers: {
                            token: sessionStorage.getItem('token'),
                            id: sessionStorage.getItem('id')
                        }
                    })
                        .then(function (post) {
                            var $src = $this.attr('src');
                            var $modal = $('#photoModal');
                            var $title = $('<h3>')
                                .text(post.title);
                            var $image = $('<img>')
                                .attr('class', 'modalPhoto')
                                .attr('src', post.pictureUrl)
                                .attr('data-photoid', post.id)
                                .attr('width', '100%');
                            $('#photoModal .modal-header')
                                .prepend($title);
                            $('#photoModal .modal-body')
                                .append($image);
                            $modal.modal('show');
                        });
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