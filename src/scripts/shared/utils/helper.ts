// Convert time value from CSS format to JS
export function cssTime(varName: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  if (value.endsWith("ms")) return parseFloat(value) / 1000;
  if (value.endsWith("s")) return parseFloat(value);
  return parseFloat(value);
}

// Get CSS custom properties in JS
export function customProp(varName: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  return value;
}
