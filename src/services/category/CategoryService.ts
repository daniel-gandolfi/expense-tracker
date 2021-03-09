import { CategoryCollection, CategoryColor, ColorKey } from 'collection/CategoryCollection';

export const categoryDao = new CategoryCollection();

export function* randomColorSequenceGenerator(): Generator<ColorKey> {
  const availableColors: ColorKey[] = Object.keys(CategoryColor) as ColorKey[];
  let index = 0;
  while (true) {
    yield availableColors[index];
    // i select with 2 colors "distance" to improve constrast as much as possible.
    // I once heard of a library that generates enough contrast maybe i should find it
    index = (index + 2) % availableColors.length;
  }
}
