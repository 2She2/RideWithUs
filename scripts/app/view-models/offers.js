/**
 * Offers view model
 */

var app = app || {};

app.Offers = (function () {
    'use strict'

    // Offers model
    var offersModel = (function () {

        var offerModel = {

            id: 'Id',
            fields: {
                LocationTitle: {
                    field: 'LocationTitle',
                    defaultValue: ''
                },
                DestinationTitle: {
                    field: 'DestinationTitle',
                    defaultValue: ''
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: null
                },
                RequesterId: {
                    field: 'RequesterId',
                    defaultValue: null
                },
                FreeSeats: {
                    field: 'FreeSeats',
                    defaultValue: 0
                },
                TimeLeaving: {
                    field: 'TimeLeaving',
                    defaultValue: null
                },
                Destination: {
                    field: 'Destination',
                    defaultValue: null
                },
                Location: {
                    field: 'Location',
                    defaultValue: null
                },
                IsDriver: {
                    field: 'IsDriver',
                    defaultValue: false
                }
            },
            CreatedAtFormatted: function () {
                // TODO Change it to time leaving
                return app.helper.formatDate(this.get('CreatedAt'));
            },
            PictureUrl: function () {

                return app.helper.resolvePictureUrl(this.get('Picture'));
            },
            User: function () {

                // TODO Resposer as well
                var userId = this.get('CreatedBy');

                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];

                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            },
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');

                return currentUserId === userId;
            }
        };

        // Offers data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var driversOffersDataSource = new kendo.data.DataSource({
            type: 'everlive',

            schema: {
                model: offerModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Offers'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-offers-span').hide();
                } else {
                    $('#no-offers-span').show();
                }
            },
            filter: {
                field: "IsDriver",
                operator: "eq",
                value: true
            },
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            }
        });

        var passengersOffersDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: offerModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Offers'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-offers-span').hide();
                } else {
                    $('#no-offers-span').show();
                }
            },
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            },
            filter: {
                field: "IsDriver",
                operator: "eq",
                value: false
            }
        });

        return {
            driversOffers: driversOffersDataSource,
            passengersOffers: passengersOffersDataSource
        };

    }());

    // Offers view model
    var offersViewModel = (function () {

        // Navigate to offersyView When some offer is selected
        var driverSelected = function (e) {
            app.checkNetworkConnection();

            app.mobileApp.navigate('views/driverView.html?uid=' + e.data.uid);
        };

        var passengerSelected = function (e) {
            app.checkNetworkConnection();

            app.mobileApp.navigate('views/passengerView.html?uid=' + e.data.uid);
        };

        return {
            driversOffers: offersModel.driversOffers,
            passengersOffers: offersModel.passengersOffers,

            driverSelected: driverSelected,
            passengerSelected: passengerSelected
        };

    }());

    return offersViewModel;

}());