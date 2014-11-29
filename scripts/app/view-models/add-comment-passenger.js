/**
 * AddCommentPassenger view model
 */

var app = app || {};

app.AddCommentPassenger = (function () {
    'use strict'

    var AddCommentViewModel = (function () {
        
        var $newComment;
        var validator;
        
        var init = function () {
            
            validator = $('#enterCommentPassenger').kendoValidator().data('kendoValidator');
            $newComment = $('#newCommentPassenger');
        };
        
        var show = function () {
            
            // Clear field on view show
            $newComment.val('');
            validator.hideMessages();
        };
        
        var saveCommentPassenger = function () {
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new comment to Comments model
                var comments = app.Comments.commentsPassengers;
                var comment = comments.add();
                
                comment.Comment = $newComment.val();
                comment.UserId = app.Users.currentUser.get('data').Id;
                comment.OfferId = app.PassengerOffer.offer().Id;
                
                comments.one('sync', function () {
                    app.mobileApp.navigate('#:back');
                });
                
                comments.sync();
            }
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveCommentPassenger: saveCommentPassenger
        };
        
    }());
    
    return AddCommentViewModel;
    
}());
