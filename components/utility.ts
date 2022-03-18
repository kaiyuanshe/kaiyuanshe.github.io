export const VariantColors = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'dark',
  'light',
] as const;

export function text2color(raw: string) {
  const sum = [...raw].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return VariantColors[sum % VariantColors.length];
}
