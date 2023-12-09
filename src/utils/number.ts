export const getSumOfNumbers = (numbers: number[]) => {
  if (numbers.length === 0) return 0
  return numbers.reduce((prev, val) => prev + val)
}

export const getMaxNumber = (numbers: number[]) =>
  numbers.reduce((prev, curr) => (prev > curr ? prev : curr))

export const generatePermutations = (n: number): number[][] => {
  const result: number[][] = []

  function swap(arr: number[], i: number, j: number) {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  function permute(arr: number[], startIndex: number, endIndex: number) {
    if (startIndex === endIndex) {
      result.push([...arr])
    } else {
      for (let i = startIndex; i <= endIndex; i++) {
        swap(arr, startIndex, i)
        permute(arr, startIndex + 1, endIndex)
        swap(arr, startIndex, i) // backtrack
      }
    }
  }

  const initialArray = Array.from({ length: n }, (_, index) => index + 1)
  permute(initialArray, 0, initialArray.length - 1)

  return result
}
