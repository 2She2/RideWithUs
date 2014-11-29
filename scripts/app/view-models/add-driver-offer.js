/**
 * AddDriverOffer view model
 */

var app = app || {};

app.AddDriverOffer = (function () {
    'use strict'

    var AddDriverOfferViewModel = (function () {

        var $locationTitle;
        var validator;
        var $destinationTitle;
        var $timeLeaving;
        var $freeSeats;

        var init = function () {

            validator = $('#enterStatus').kendoValidator().data('kendoValidator');
            $locationTitle = $('#locationTitle');
            $destinationTitle = $('#destinationTitle');
            $timeLeaving = $('#timeLeaving');
            $freeSeats = $('#freeSeats');
        };

        var show = function () {

            // Clear field on view show
            $locationTitle.val('');
            $locationTitle.val('');
            $destinationTitle.val('');
            $timeLeaving.val('');
            $freeSeats.val('');
            validator.hideMessages();
        };

        var saveOffer = function () {
            app.checkNetworkConnection();

            // Validating of the required fields
            if (validator.validate()) {

                var fileName = Math.random().toString(36).substring(2, 15) + ".jpg";

                var success = function (data) {
                    app.everlive.Files.create({
                        Filename: fileName,
                        ContentType: "image/jpeg",
                        base64: data
                    }).then(addOfferToType);
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
                var addOfferToType = function (image) {
                    var offers = app.Offers.driversOffers;
                    var offer = offers.add();

                    // TODO: GET geolocation
                    offer.LocationTitle = $locationTitle.val();
                    offer.DestinationTitle = $destinationTitle.val();
                    offer.RequesterId = app.Users.currentUser.get('data').Id;
                    offer.Picture = image.result.Id;
                    offer.TimeLeaving = $timeLeaving.val();
                    offer.IsDriver = true;
                    offer.FreeSeats = parseInt($freeSeats.val());

                    offers.one('sync', function () {
                        app.mobileApp.navigate('#:back');
                    });

                    offers.sync();
                }
            }
        };

        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveOffer: saveOffer
        };

    }());

    return AddDriverOfferViewModel;
}());