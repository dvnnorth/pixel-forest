$(function () {

    var loginEndpoint = window.location.protocol + '//' + window.location.host + '/';
    var profileEndpoint = window.location.protocol + '//' + window.location.host + '/profile';


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
                    var url = post.pictureUrl;
                    var thumbnailUrl = 'http://142.93.206.185/img/' + url.substring(url.lastIndexOf('/') + 1)
                        .split('?')[0]
                        .split('.')[0] + '_thumb' + url.substring(url.lastIndexOf('.'), url.lastIndexOf('?'));
                    var newImg = $('<img>')
                        .attr('class', 'profilePhoto')
                        .attr('src', thumbnailUrl)
                        // Commenting out to revive in case digitalocean dies
                        //.attr('src', post.pictureUrl)
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
                                .attr('id', 'modalTitle')
                                .text(post.title);
                            var $image = $('<img>')
                                .attr('class', 'modalPhoto')
                                .attr('src', post.pictureUrl)
                                .attr('data-photoid', post.id)
                                .attr('width', '100%');
                            var $body = $('<p>')
                                .attr('id', 'modalBody')
                                .text(post.body);

                            // Clear the modal
                            $('#photoModal .modal-header').empty();
                            $('#photoModal .modal-body').empty();

                            $('#photoModal .modal-header')
                                .prepend($title);
                            $('#photoModal .modal-body')
                                .append($image)
                                .append($body);
                            $modal.modal('show');
                        });
                });

                //Photo Delete Functionality
                $('#photoDelete').on('click', function (event) {
                    var photoId = $('.modalPhoto').data('photoid');
                    var route = '/api/profile/post/' + photoId;
                    $.ajax({
                        method: 'DELETE',
                        url: route,
                        async: true,
                        headers: {
                            token: sessionStorage.getItem('token'),
                            id: sessionStorage.getItem('id')
                        }
                    })
                        .then(function () {
                            window.location.replace(profileEndpoint);
                        });
                });

                //Photo Edit Functionality
                $('#photoEdit').on('click', function (event) {
                    // Switch the title and body to forms
                    var title = $('#modalTitle').text();
                    var body = $('#modalBody').text();
                    var $titleForm = $('<input>')
                        .attr('type', 'text')
                        .attr('id', 'newTitle')
                        .attr('class', 'form-control')
                        .attr('placeholder', title)
                        .attr('value', title);
                    // <textarea id="postBody" name="description" cols="30" rows="5" placeholder="Description"></textarea>
                    var $bodyForm = $('<textarea>')
                        .attr('id', 'newBody')
                        .attr('class', 'mt-2')
                        .attr('cols', 26)
                        .attr('rows', 5)
                        .attr('placeholder', body)
                        .text(body);
                    $('#modalTitle').remove();
                    $('#modalBody').remove();
                    $('#photoModal .modal-header')
                        .append($titleForm);
                    $('#photoModal .modal-body')
                        .append($bodyForm);
                    // display submit button (need separate handler for delete button onclick)\
                    $('#photoEditSubmit').removeClass('d-none');
                });

                $('#photoEditSubmit').on('click', function (event) {
                    var newTitle = $('#newTitle').val().trim();
                    var newBody = $('#newBody').val().trim();
                    var photoId = $('.modalPhoto').data('photoid');
                    var route = '/api/profile/post/' + photoId;
                    var newData = {
                        title: newTitle,
                        body: newBody
                    };
                    if (newTitle === '' || newBody === '') {
                        $('#editError').text('Both the title and body fields must have a value');
                    }
                    else {
                        $.ajax({
                            method: 'PUT',
                            url: route,
                            async: true,
                            headers: {
                                token: sessionStorage.getItem('token'),
                                id: sessionStorage.getItem('id')
                            },
                            data: newData
                        })
                            .then(function () {
                                window.location.replace(profileEndpoint);
                            })
                            .catch(function (error) {
                                if (error) {
                                    $('#editError').text(error);
                                }
                            });
                    }
                });

                // Get Share Link
                $('#photoShare').on('click', function (event) {
                    var photoId = $('.modalPhoto').data('photoid');
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
                            if ($.trim($('#shareLink').html())) {
                                $('#shareLink').empty();
                            }
                            var $shareHeader = $('<p>')
                                .text('Sharable Link:');
                            var $shareLink = $('<textarea>')
                                .attr('id', 'shareLink')
                                .attr('class', 'mt-2')
                                .attr('cols', 26)
                                .attr('rows', 5)
                                .attr('placeholder', post.pictureUrl)
                                .text(post.pictureUrl);
                            $('#shareLink')
                                .append($shareHeader)
                                .append($shareLink);
                            var vanillaLink = $shareLink[0]
                            vanillaLink.select();
                        })
                        .catch(function (error) {
                            if (error) {
                                $('#editError').text(error);
                            }
                        });
                });

                // Delete Account functionality
                $('#deleteAccountCancel').on('click', function (event) {
                    $('#deleteModal').modal('hide');
                });

                $('#deleteAccount')
            })
            .fail(function () {
                window.location.replace(loginEndpoint);
            });
    }
    else {
        window.location.replace(loginEndpoint);
    }
});