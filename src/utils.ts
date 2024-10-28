/**
 *
 * @param pouchSize - Amount of food requested for cat
 * @returns price based on pouch size as a string
 */
export const findPrice = (pouchSize: string): number => {
  let price = 0;

  if (pouchSize === 'A') {
    price = 55.5;
  } else if (pouchSize === 'B') {
    price = 59.5;
  } else if (pouchSize === 'C') {
    price = 62.75;
  } else if (pouchSize === 'D') {
    price = 66.0;
  } else if (pouchSize === 'E') {
    price = 69.0;
  } else if (pouchSize === 'BF') {
    price = 71.25;
  }

  return price;
};
