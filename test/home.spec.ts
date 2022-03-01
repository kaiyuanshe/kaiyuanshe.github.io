describe('Home page', () => {
  beforeAll(() => page.goto('http://localhost:3000', { timeout: 60000 }));

  it('should render Page head & foot', async () => {
    const title = 'Next-Bootstrap.ts';

    expect(await page.title()).toBe(title);

    const brand = (await page.$('.navbar-brand'))?.textContent();

    expect(await brand).toBe(title);

    const footer = (await page.$('#__next > footer'))?.textContent();

    expect(await footer).toMatch(/^Powered by/);
  });

  it('should render Nav links', async () => {
    const navLinks = (await page.$$('.navbar-nav .nav-link')).map(link =>
      link.textContent(),
    );
    expect(await Promise.all(navLinks)).toEqual(['Component', 'Source code']);
  });

  it('should render Nav Card list', async () => {
    const links = await page.$$('[class*="Home_grid__"] .card');

    expect(links).toHaveLength(4);

    const path = (await links[0].$('.card-title a'))?.getAttribute('href');

    expect(await path).toMatch(/^https:\/\/nextjs.org\//);
  });

  it('should render Upstream Project list', async () => {
    const projects = await page.$$('main > .row:last-child .card');

    expect(projects).toHaveLength(3);

    const path = (await projects[0].$('img'))?.getAttribute('src');

    expect(await path).not.toBeNull();
  });
});

export {};
