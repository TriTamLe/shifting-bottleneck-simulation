import { Job } from '../types'

export const consoleLogAll = (value: any) => {
  return console.log(JSON.stringify(value, null, 2))
}

export const returnLastElementOfAnArray = (array: any[]) => {
  return array[array.length - 1]
}

function hasDuplicates(array: number[]): boolean {
  return new Set(array).size !== array.length
}

export const validateInitialJob = (jobs: Job[]): boolean => {
  if (jobs.length === 0) {
    console.log('jobs is empty')
    return false
  }
  if (
    !jobs.every((job) => job.machineFlow.length === job.processTimeFlow.length)
  ) {
    console.log('There are some jobs not valid')
    return false
  }

  if (!jobs.every((job) => !hasDuplicates(job.machineFlow))) {
    console.log('There are some machine flow has duplicates')
    return false
  }

  if (
    !jobs.every((job) =>
      job.processTimeFlow.every((processTime) => processTime !== 0)
    )
  ) {
    console.log('There are some process time is 0')
    return false
  }

  return true
}
