import { proxyGithub } from './core';

export default proxyGithub((path, data) => {
  return data;
});
