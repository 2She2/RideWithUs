/**
 * Users model
 */

var app = app || {};

app.Menu = (function () {
    'use strict';

    var menuModel = (function () {

        var loadDrivers = function () {
            app.checkNetworkConnection();

            app.mobileApp.navigate('views/driversView.html');
        }

        var loadPassengers = function () {
            app.checkNetworkConnection();

            app.mobileApp.navigate('views/offersView.html');
        }

        var navigateHome = function () {
            app.checkNetworkConnection();

            app.mobileApp.navigate('#welcome');
        };

        var logout = function () {
            app.checkNetworkConnection();

            app.helper.logout()
                .then(navigateHome, function (err) {
                    app.showError(err.message);
                    navigateHome();
                });
        };

        return {
            loadDrivers: loadDrivers,
            loadPassengers: loadPassengers,
            logout: logout
        };

    }());

    return menuModel;

}());