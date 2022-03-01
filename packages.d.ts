declare module '*.less' {
  const map: Record<string, string>;

  export default map;
}

declare module '@editorjs/*' {
  const Plugin: import('react').ComponentClass;

  export default Plugin;
}
