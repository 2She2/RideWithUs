/**
 * Offer view model
 */

var app = app || {};

app.DriverOffer = (function () {
    'use strict'

    var $commentsContainer,
        listScroller;

    var driverOfferViewModel = (function () {

        var offerUid,
            offer,
            $offerPicture;

        var init = function () {
            $commentsContainer = $('#comments-listview');
            $offerPicture = $('#picture');
        };

        var show = function (e) {
            app.checkNetworkConnection();

            $commentsContainer.empty();

            listScroller = e.view.scroller;
            listScroller.reset();

            offerUid = e.view.params.uid;
            // Get current offer (based on item uid) from Offers model

            offer = app.Offers.driversOffers.getByUid(offerUid);
            $offerPicture[0].style.display = offer.Picture ? 'block' : 'none';

            //console.dir(offer.Picture)
            //$offerPicture[0].style.display = offer.Picture ? 'block' : 'none';

            app.Comments.commentsDrivers.filter({
                field: 'OfferId',
                operator: 'eq',
                value: offer.Id
            });

            kendo.bind(e.view.element, offer, kendo.mobile.ui);
        };

        var back = function () {
            app.checkNetworkConnection();
            app.mobileApp.navigate('#:back');
        }

        var removeOffer = function () {
            app.checkNetworkConnection();

            var offers = app.Offers.driversOffers;
            var offer = offers.getByUid(offerUid);

            app.showConfirm(
                appSettings.messages.removeOfferConfirm,
                'Delete Offer',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {

                        offers.remove(offer);
                        offers.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        offers.sync();
                    }
                }
            );
        };

        var joinOffer = function () {
            app.checkNetworkConnection();

            var offers = app.Offers.driversOffers;
            var offer = offers.getByUid(offerUid);
        var data = app.everlive.data('Offers');



            app.showConfirm(
                appSettings.messages.joinOfferConfirm,
                'Join Offer',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {

                        data.updateSingle({
                                Id: offer.Id,
                                'FreeSeats': offer.FreeSeats - 1
                            },
                            function (data) {
                                alert(JSON.stringify(data));
                            },
                            function (error) {
                                alert(JSON.stringify(error));
                            });

                        data.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        offers.sync();
                    }
                }
            );
        };

        return {
            init: init,
            show: show,
            back: back,
            remove: removeOffer,
            join: joinOffer,
            offer: function () {
                return offer;
            },
        };

    }());

    return driverOfferViewModel;

}());