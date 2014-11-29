/**
 * Offer view model
 */

var app = app || {};

app.PassengerOffer = (function () {
    'use strict'

    var $commentsContainer,
        listScroller;

    var passengerOfferViewModel = (function () {

        var offerUid,
            offer,
            $offerPicture;

        var init = function () {
            $commentsContainer = $('#passengers-listview');
            $offerPicture = $('#picture');
        };

        var show = function (e) {
            app.checkNetworkConnection();

            $commentsContainer.empty();

            listScroller = e.view.scroller;
            listScroller.reset();

            offerUid = e.view.params.uid;
            // Get current offer (based on item uid) from Offers modl

            offer = app.Offers.passengersOffers.getByUid(offerUid);
            $offerPicture[0].style.display = offer.Picture ? 'block' : 'none';

            //console.dir(offer.Picture)
            //$offerPicture[0].style.display = offer.Picture ? 'block' : 'none';

            app.Comments.commentsPassengers.filter({
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

            var offers = app.Offers.passengersOffers;
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

        return {
            init: init,
            show: show,
            back: back,
            remove: removeOffer,
            offer: function () {
                return offer;
            },
        };

    }());

    return passengerOfferViewModel;

}());