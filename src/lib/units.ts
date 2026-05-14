export const toKg = (lb: number): number =>
  Math.round(lb * 0.453592 * 10) / 10;

export const toCm = (ft: number, inches: number): number =>
  Math.round(((ft * 30.48) + (inches * 2.54)) * 10) / 10;

export const toLb = (kg: number): number =>
  Math.round(kg / 0.453592 * 10) / 10;

export const toFtIn = (cm: number): { ft: number; inches: number } => ({
  ft:     Math.floor(cm / 30.48),
  inches: Math.round((cm % 30.48) / 2.54),
});
