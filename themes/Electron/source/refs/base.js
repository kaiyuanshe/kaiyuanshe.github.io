/*
 * menu
 */
$(function(){
    var
        isHidden = true,
        nav = $('.navbar-list'),
        search = $('.navbar-search');

    $('#touch-menu-btn').on('click', function(){
        if(isHidden){
            nav.show();
            search.show();
        }else{
            nav.hide();
            search.hide();
        }
        isHidden = !isHidden;
    });
});


/*
 * Search
 */
$(function(){
    var
        form = $('#search-form'),
        text = form.find('input:text'),
        btn = $('.search-form-submit'),
        searchURL = 'http://www.bing.com/search?q=',
        keyword;

    form.attr('action', '');
    text.attr('placeholder', '请输入关键字');

    btn.on('click', function(){
        keyword = text.val();

        if(keyword.replace(' ', '') == '')
            return false;

        //form.attr('action', searchURL + keyword);
        //$('#search-form').submit();
        location.href = searchURL + keyword;
    });
});

/* footer */
$(function(){
    var
        windowHeight = $(window).height(),
        headerHeight = $('.header').outerHeight(true),
        footerHeight = $('.footer').outerHeight(true);

    $('.wrapper > .content').css({'min-height' : windowHeight - headerHeight - footerHeight});
});

/* Redirect to next page */
$(function(){
    $('.page-jump input').each(function(){
        var
            _this = $(this);

        if(_this.attr('data-redirect'))
            _this.on('click', function(){
                location.href = $(this).attr('data-redirect');
            });
    });

});

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-55813689-1', 'auto');
  ga('send', 'pageview');