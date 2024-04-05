hljs.initHighlightingOnLoad();

$( document ).ready(function () {

  $('section > table, main > table').addClass('table').each(function () {

    if (! this.tHead.textContent.trim())
      $(this.tHead).remove();
    else
      $('th[align="center"]', this.tHead).addClass('text-center');
  });
});
