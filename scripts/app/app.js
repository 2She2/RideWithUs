var app = (function (win) {
    'use strict';

    function getMediaURL(s) {
        if (device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
        return s;
    }

    function mediaError(e) {
        alert('Media Error');
    }

    // Global error handling
    var showAlert = function (message, title, callback) {

        var src = "http://www.waveevents.com/MyFilez/wavs/variety/bonewah.wav";

        var media = new Media(src, success, mediaError);
        media.play();

        function success() {

        }

        navigator.notification.vibrate(200);

        navigator.notification.alert(message, callback || function () {}, title, 'OK');
    };

    var showError = function (message) {
        showAlert(message, 'Error occured');
    };

    win.addEventListener('error', function (e) {
        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        showAlert(message, 'Error occured');

        return true;
    });

    // Global confirm dialog
    var showConfirm = function (message, title, callback) {
        navigator.notification.vibrate(200);
        navigator.notification.confirm(message, callback || function () {}, title, ['OK', 'Cancel']);
    };

    var isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };

    var fixViewResize = function () {
        if (device.platform === 'iOS') {
            setTimeout(function () {
                $(document.body).height(window.innerHeight);
            }, 10);
        }
    };

    // Handle device back button tap
    var onBackKeyDown = function (e) {
        e.preventDefault();

        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {
                // Stop EQATEC analytics monitor on app exit
                if (analytics.isAnalytics()) {
                    analytics.Stop();
                }
                AppHelper.logout().then(exit, exit);
            }
        }, 'Exit', ['OK', 'Cancel']);
    };

    var checkNetworkConnection = function () {
        var networkState = navigator.connection.type;
        if (networkState === Connection.NONE || networkState === Connection.UNKNOWN) {

            navigator.notification.confirm('Network state: ' + networkState, function (confirmed) {
                if (analytics.isAnalytics()) {
                    analytics.Stop();
                }

                navigator.app.exitApp();

            }, 'Network Error', ['OK']);
        }
    };

    var onDeviceReady = function () {
        checkNetworkConnection();
        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);

        navigator.splashscreen.hide();
        fixViewResize();

        if (analytics.isAnalytics()) {
            analytics.Start();
        }

        // Initialize AppFeedback
        if (app.isKeySet(appSettings.feedback.apiKey)) {
            try {
                feedback.initialize(appSettings.feedback.apiKey);
            } catch (err) {
                console.log('Something went wrong:');
                console.log(err);
            }
        }
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);
    // Handle "orientationchange" event
    document.addEventListener('orientationchange', fixViewResize);

    // Initialize Everlive SDK
    var el = new Everlive({
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    });

    var emptyGuid = '00000000-0000-0000-0000-000000000000';

    var AppHelper = {

        // Return user profile picture url
        resolveProfilePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return 'styles/images/avatar.png';
            }
        },

        // Return current offer picture url
        resolvePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return '';
            }
        },

        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {
            return kendo.toString(new Date(dateString), 'MMM d, yyyy H:mm:ss');
        },

        // Current user logout
        logout: function () {
            return el.Users.logout();
        }
    };

    var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
        transition: 'slide',
        statusBarStyle: statusBarStyle,
        skin: 'flat'
    });

    var getYear = (function () {
        return new Date().getFullYear();
    }());

    return {
        showAlert: showAlert,
        showError: showError,
        showConfirm: showConfirm,
        isKeySet: isKeySet,
        mobileApp: mobileApp,
        helper: AppHelper,
        everlive: el,
        getYear: getYear,
        checkNetworkConnection: checkNetworkConnection
    };
}(window));