/* Js for module=license&method=tool&device=desktop&lang=zh-cn, Version=1565524537 */
 v.lang = {"confirmDelete":"\u60a8\u786e\u5b9a\u8981\u6267\u884c\u5220\u9664\u64cd\u4f5c\u5417\uff1f","deleteing":"\u5220\u9664\u4e2d","doing":"\u5904\u7406\u4e2d","loading":"\u52a0\u8f7d\u4e2d","updating":"\u66f4\u65b0\u4e2d...","timeout":"\u7f51\u7edc\u8d85\u65f6,\u8bf7\u91cd\u8bd5","errorThrown":"<h4>\u6267\u884c\u51fa\u9519\uff1a<\/h4>","continueShopping":"\u7ee7\u7eed\u8d2d\u7269","required":"\u5fc5\u586b","back":"\u8fd4\u56de","continue":"\u7ee7\u7eed","importTip":"\u53ea\u5bfc\u5165\u4e3b\u9898\u7684\u98ce\u683c\u548c\u6837\u5f0f","fullImportTip":"\u5c06\u4f1a\u5bfc\u5165\u6d4b\u8bd5\u6570\u636e\u4ee5\u53ca\u66ff\u6362\u7ad9\u70b9\u6587\u7ae0\u3001\u4ea7\u54c1\u7b49\u6570\u636e"};;$().ready(function()
{
    $('.ui-customSelect-dropdown [type=radio]').click(function()
    {
        $(this).parents('ul').toggle();
    });

    $('.ui-customSelect-window').click(function()
    {
        $('.ui-customSelect-dropdown ul').show();
    });
})
$().ready(function()
{
    $('#searchbar form').after($('#headNav nav'));
    $('#header.compatible.with-searchbar #headNav').remove();
})

;
var hash = window.location.hash.substring(1);
var browserLanguage = navigator.language || navigator.userLanguage; 
var resolution      = screen.availWidth + ' X ' + screen.availHeight;
$.get(createLink('log', 'record', "hash=" + hash), {browserLanguage:browserLanguage, resolution:resolution});
