export function pickRandom(items: any): any {
  const keys = Object.keys(items);
  const min = 0;
  const max = keys.length;
  const index = Math.floor(Math.random() * (max - min)) + min;

  return items[index];
}
