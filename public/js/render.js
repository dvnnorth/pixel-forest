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

                content.forEach(function (post) {
                    // This builds the images with a close button that will delete each image when clicked
                    // On click event for deleting above. Use data-deleteid attribute of button
                    var newImg = $('<img>')
                        .attr('class', 'profilePhoto')
                        .attr('src', post.pictureUrl)
                        .attr('data-photoid', post.id)
                        .attr('width', 260)
                        .attr('height', 260)
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
                            var $modal = $('#exampleModalCenter');
                            var $wrapper = $();
                            var $title = $()
                            var $image = $('<img>')
                                .attr('class', 'modalPhoto')
                                .attr('src', post.pictureUrl)
                                .attr('data-photoid', post.id)
                                .attr('width', 260)
                                .attr('height', 260);
                            $('#exampleModalCenter .modal-content')
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