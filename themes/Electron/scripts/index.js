const { VEvent } = require('icalendar');

hexo.extend.helper.register('echo', console.log);

hexo.extend.helper.register('groupBy', (list, grouper) => {
  const data = {};

  for (const item of list) {
    let keys = grouper instanceof Function ? grouper(item) : item[grouper];

    if (!(keys instanceof Array)) keys = [keys];

    for (const key of new Set(keys)) (data[key] = data[key] || []).push(item);
  }

  return data;
});

hexo.extend.helper.register('getPosts', ({ pagination, filter }) => {
  const { order_by, per_page } = hexo.config.index_generator;

  var { data } = hexo.locals.get('posts').sort(order_by);

  if (filter instanceof Function) data = data.filter(filter);

  return data.slice(0, pagination ? per_page : Infinity);
});

hexo.extend.helper.register('hasCategory', (post, name) =>
  Array.from((post.categories || '').data, ({ name }) => name).includes(name)
);

const type_map = {
  doc: 'word',
  docx: 'word',
  xls: 'excel',
  xlsx: 'excel',
  ppt: 'powerpoint',
  pptx: 'powerpoint',
};

hexo.extend.helper.register('fileType', (path) => {
  var type = path.split('.');

  if (!type[1]) return;

  type = type.slice(-1)[0].toLowerCase();

  return type_map[type] || type;
});

hexo.extend.helper.register('urlFor', (path, base) =>
  /^(\w+:)?\/\//.test(path) ? path : base + path
);

hexo.extend.helper.register(
  'toDataURI',
  (data, type = '') =>
    `data:${type};base64,${Buffer.from(data).toString('base64')}`
);

hexo.extend.helper.register(
  'eventOf',
  (title, description, start, end, location) => {
    const event = new VEvent();

    event.setSummary(title);

    event.setDescription(description);

    event.setDate(new Date(start), new Date(end));

    event.setLocation(location);

    return event;
  }
);
