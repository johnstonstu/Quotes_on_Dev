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
        } else if (data[0]._qod_quote_source.length > 0) {
          $('.entry-content').empty();
          $('.entry-content').append(data[0].content['rendered']);

          $('.entry-title').empty();
          $('.entry-title').append(data[0].title['rendered']);

          $('.source').empty();
          $('.source').append(
            ', ' + '<p>' + data[0]._qod_quote_source + '</p>'
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
  $('#quote-submission-form').on('submit', function(e) {
    e.preventDefault();
    var author = $('#quote-author').val();
    var quote = $('#quote-content').val();
    var quoteSrc = $('#quote-source').val();
    var quoteUrl = $('#quote-source-url').val();
    console.log('auth: ' + author);
    console.log('quote: ' + quote);
    console.log('src: ' + quoteSrc);
    console.log('quoteURL: ' + quoteUrl);

    // $.ajax({
    //   method: 'post',
    //   url: api_vars.root_url + 'wp/v2/posts/' + api_vars.post_id,
    //   data: {
    //     comment_status: 'closed'
    // title: author
    // content: quote
    // _qod_quote_source: quoteSrc
    // _qod_quote_source_url: quoteUrl
    //   },
    //   beforeSend: function(xhr) {
    //     xhr.setRequestHeader('X-WP-Nonce', api_vars.nonce);
    //   }
    // }).done(function(response) {
    //   alert('Success! Comments are closed for this post.');
    // });

    $('#quote-author').val('');
    $('#quote-content').val('');
    $('#quote-source').val('');
    $('#quote-source-url').val('');
  });
})(jQuery);
