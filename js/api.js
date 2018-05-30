(function($) {
  'use strict';

  // for history
  var lastPage = '';

  /**
   * Ajax-based random post fetching & History API
   */

  //fetch new data from api on click button
  $('#new-quote-button').on('click', function(e) {
    e.preventDefault();
    console.log('you clicked the button!');

    lastPage = document.URL;

    $.ajax({
      method: 'get',
      url:
        api_vars.root_url +
        'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
      cache: false
    })
      .done(function(data) {
        if (data[0]._qod_quote_source_url.length > 0) {
          $('.entry-content').empty();
          $('.entry-content').append(data[0].content['rendered']);

          $('.entry-title').empty();
          $('.entry-title').append(data[0].title['rendered']);

          $('.source').empty();
          $('.source').append(
            ', <a href="' +
              data[0]._qod_quote_source_url +
              '">' +
              data[0]._qod_quote_source +
              '</a>'
          );
        } else {
          $('.source').empty();
          $('.entry-content').empty();
          $('.entry-content').append(data[0].content['rendered']);

          $('.entry-title').empty();
          $('.entry-title').append(data[0].title['rendered']);
        }

        // for history, back button
        history.pushState(null, null, data[0].slug);

        $(window).on('popstate', function() {
          window.location.replace(lastPage);
        });
      })
      .fail(function() {
        alert('Ajax request failed, sorry.');
      });
  });

  /**
   * Ajax-based front-end post submissions.
   *
   * post request ajax
   *
   * api_vars.nonce
   */
})(jQuery);
