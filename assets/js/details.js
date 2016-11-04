(function() {
  $(document).on('details.post.show', function(e, postId) {
    return console.log('Show ' + postId);
  });

}).call(this);
