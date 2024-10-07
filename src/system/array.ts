export async function asyncReduce<T, U>(
  array: T[],
  callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => Promise<U>,
  initialValue: U,
): Promise<U> {
  let accumulator = initialValue;
  for (let i = 0; i < array.length; i++) {
    accumulator = await callbackfn(accumulator, array[i], i, array);
  }
  return accumulator;
}
