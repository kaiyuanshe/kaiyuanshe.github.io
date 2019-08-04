$( document ).ready(function () {

  $('.blog-post table, .blog-index table').addClass('table').each(function () {

    if (! this.tHead.textContent.trim())
      $(this.tHead).remove();
    else
      $('th[align="center"]', this.tHead).addClass('text-center');
  });
});
