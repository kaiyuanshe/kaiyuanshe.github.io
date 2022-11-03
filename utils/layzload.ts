export function LazyLoad() {
  setTimeout(() => {
    const images = document.querySelectorAll('img[data-src]:not([isLazyLoad])');
    function callback(entries: any) {
      for (let i of entries) {
        if (i.isIntersecting) {
          let img = i.target;
          let trueSrc = img.getAttribute('data-src');
          trueSrc &&
            (img.setAttribute('src', trueSrc),
            img.setAttribute('isLazyLoad', true),
            observer.unobserve(img));
        }
      }
    }
    const observer = new IntersectionObserver(callback);
    for (let i of images) {
      observer.observe(i);
    }
  }, 10);
}
