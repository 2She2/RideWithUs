/**
 * Comments view model
 */

var app = app || {};

app.Comments = (function () {
    'use strict'

    var commentsViewModel = (function () {
        
        var commentModel = {
            id: 'Id',
            fields: {
                Comment: {
                    field: 'Comment',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                OfferId: {
                    field: 'OfferId',
                    defaultValue: null
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: null
                }
            },
            CreatedAtFormatted: function () {

                return app.helper.formatDate(this.get('CreatedAt'));
            },
            User: function () {

                var userId = this.get('UserId');

                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];

                return user ? user.DisplayName : 'Anonymous';
            }
        };
        
        var commentsDriversDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: commentModel
            },
            transport: {
                typeName: 'Comments'
            },
            serverFiltering: true,
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#comments-drivers-listview').kendoMobileListView({
                        dataSource: e.items,
                        template: kendo.template($('#commentsDriversTemplate').html())
                    });
                } else {
                    $('#comments-drivers-listview').empty();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });
        
          var commentsPassengersDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: commentModel
            },
            transport: {
                typeName: 'Comments'
            },
            serverFiltering: true,
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#comments-passengers-listview').kendoMobileListView({
                        dataSource: e.items,
                        template: kendo.template($('#commentsPassengersTemplate').html())
                    });
                } else {
                    $('#comments-passengers-listview').empty();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });
        
        return {
            commentsDrivers: commentsDriversDataSource,
            commentsPassengers: commentsPassengersDataSource
        };
        
    }());
    
    return commentsViewModel;

}());
