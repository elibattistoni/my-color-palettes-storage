export const isValidColor = (color: string): boolean => {
  if (!color || typeof color !== "string") return false;

  const trimmedColor = color.trim();
  if (!trimmedColor) return false;

  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const rgbaPattern = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;

  // Check hex format
  if (hexPattern.test(trimmedColor)) return true;

  // Check RGB format and validate values are 0-255
  const rgbMatch = trimmedColor.match(rgbPattern);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return [r, g, b].every((val) => {
      const num = parseInt(val, 10);
      return num >= 0 && num <= 255;
    });
  }

  // Check RGBA format and validate values
  const rgbaMatch = trimmedColor.match(rgbaPattern);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    const rgbValid = [r, g, b].every((val) => {
      const num = parseInt(val, 10);
      return num >= 0 && num <= 255;
    });
    const alphaValid = parseFloat(a) >= 0 && parseFloat(a) <= 1;
    return rgbValid && alphaValid;
  }

  return false;
};
