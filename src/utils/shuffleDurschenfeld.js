export default function shuffleDurschenfeld(arr) {
  // перемешивание по Дуршенфельду
  // проверка является ли аргумент массивом
  if (!Array.isArray(arr) || !arr.length) return 0;
  let j;
  // перемешивание
  for (let i = arr.length - 1; i >= 1; --i) {
    j = Math.floor(
      Math.min(0, i) + Math.random() * (Math.max(0, i) + 1 - Math.min(0, i)),
    );
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
