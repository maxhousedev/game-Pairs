export default function generateArrOfRepeatitions(
  numOfItems,
  numOfRepeations = 2,
) {
  // генератор массива повторяющихся цифр
  const result = [];
  let item = 0;
  for (let i = 0; i < numOfItems; ++i) {
    for (let j = 1; j <= numOfRepeations; ++j) {
      result.push(item);
    }
    ++item;
  }

  return result;
}
