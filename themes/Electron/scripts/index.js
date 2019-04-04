hexo.extend.helper.register('echo', console.log);


hexo.extend.helper.register('has_category',  (post, name) =>

  Array.from((post.categories || '').data,  ({ name }) => name).includes( name )
);
