/**
 * AddOffer view model
 */

var app = app || {};

app.AddOffer = (function () {
    'use strict'

    var addOfferViewModel = (function () {

        var $locationTitle;
        var validator;
        var $destinationTitle;
        var $timeLeaving;

        var init = function () {

            validator = $('#body-add-offer').kendoValidator().data('kendoValidator');
            $locationTitle = $('#locationTitle');
            $destinationTitle = $('#destinationTitle');
            $timeLeaving = $('#timeLeaving');
        };

        var show = function () {

            // Clear field on view show
            $locationTitle.val('');
            $locationTitle.val('');
            $destinationTitle.val('');
            $timeLeaving.val('');
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

                var addOfferToType = function (image) {
                    var offers = app.Offers.passengersOffers;
                    var offer = offers.add();

                    navigator.geolocation.getCurrentPosition(function () {
                        offer.LocationTitle = $locationTitle.val();
                        offer.DestinationTitle = $destinationTitle.val();
                        offer.RequesterId = app.Users.currentUser.get('data').Id;
                        offer.Picture = image.result.Id;
                        offer.TimeLeaving = $timeLeaving.val();
                        offer.IsDriver = false;

                        offers.one('sync', function () {
                            debugger;
                            app.mobileApp.navigate('#:back');
                        });

                        offers.sync();
                    }, function () {
                         navigator.notification.alert("Cannot get geolocation!");
                    });
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

    return addOfferViewModel;

}());