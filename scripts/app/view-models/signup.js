/**
 * Signup view model
 */
var app = app || {};

app.Signup = (function () {
    'use strict';

    var singupViewModel = (function () {

        var dataSource;
        var $signUpForm;
        var $formFields;
        var $signupBtnWrp;
        var validator;
        

        // Register user after required fields (username and password) are validated in Backend Services
        var signup = function () {
            var fileName = Math.random().toString(36).substring(2, 15) + ".jpg";

            var success = function (data) {
                app.everlive.Files.create({
                    Filename: fileName,
                    ContentType: "image/jpeg",
                    base64: data
                }).then(signUpUser);
            };

            var error = function () {
                navigator.notification.alert("Unfortunately we could not add the image");
            };

            var config = {
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 400,
                targetWidth: 400
            };

            navigator.camera.getPicture(success, error, config);



            // Adding new offer to Offers model
            var signUpUser = function (image) {
                dataSource.Gender = parseInt(dataSource.Gender);
                var birthDate = new Date(dataSource.BirthDate);

                if (birthDate.toJSON() === null) {
                    birthDate = new Date();
                }

                dataSource.BirthDate = birthDate;
                dataSource.Picture = image.result.Id;

                Everlive.$.Users.register(
                    dataSource.Username,
                    dataSource.Password,
                    dataSource)
                    .then(function (data) {
                            app.showAlert("Registration successful");
                            app.mobileApp.navigate('#welcome');
                        },
                        function (err) {
                            app.showError(err.message);
                        });
            }

            /*
            dataSource.Gender = parseInt(dataSource.Gender);
            var birthDate = new Date(dataSource.BirthDate);

            if (birthDate.toJSON() === null) {
                birthDate = new Date();
            }

            dataSource.BirthDate = birthDate;

            Everlive.$.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource)
            .then(function () {
                app.showAlert("Registration successful");
                app.mobileApp.navigate('#welcome');
            },
            function (err) {
                app.showError(err.message);
            });*/
        };

        // Executed after Signup view initialization
        // init form validator
        var init = function () {

            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({
                validateOnBlur: false
            }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });
        }

        // Executed after show of the Signup view
        var show = function () {

            dataSource = kendo.observable({
                Username: '',
                Password: '',
                DisplayName: '',
                Email: '',
                Gender: '0',
                About: '',
                Friends: [],
                BirthDate: new Date()
            });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
        };

        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            $signupBtnWrp.addClass('disabled');
        };

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
        }

        return {
            init: init,
            show: show,
            hide: hide,
            onSelectChange: onSelectChange,
            signup: signup
        };

    }());

    return singupViewModel;

}());