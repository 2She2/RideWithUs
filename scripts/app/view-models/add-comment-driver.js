/**
 * AddCommentDriver view model
 */

var app = app || {};

app.AddCommentDriver = (function () {
    'use strict'

    var AddCommentViewModel = (function () {
        
        var $newComment;
        var validator;
        
        var init = function () {
            
            validator = $('#enterComment').kendoValidator().data('kendoValidator');
            $newComment = $('#newComment');
        };
        
        var show = function () {
            
            // Clear field on view show
            $newComment.val('');
            validator.hideMessages();
        };
        
        var saveComment = function () {
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new comment to Comments model
                var comments = app.Comments.commentsDrivers;
                var comment = comments.add();
                
                comment.Comment = $newComment.val();
                comment.UserId = app.Users.currentUser.get('data').Id;
                comment.OfferId = app.DriverOffer.offer().Id;
                
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
            saveComment: saveComment
        };
        
    }());
    
    return AddCommentViewModel;
    
}());