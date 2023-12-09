import { Job, JobNode } from '../types'
import { consoleLogAll, returnLastElementOfAnArray } from './others'

export const calculateTotalProcessingTime = (node: JobNode[]): number => {
  let totalProcessingTime = 0
  for (const n of node) {
    totalProcessingTime += n.processingTime
  }
  return totalProcessingTime
}

export const searchJobNode = (
  startNode: JobNode,
  targetJob: number,
  targetMachine: number
): JobNode[] | null => {
  const queue: { path: JobNode[] }[] = [{ path: [startNode] }]
  let maxTotalProcessingTime = -1
  let longestPath: JobNode[] | null = null
  let foundTarget = false

  while (queue.length > 0) {
    const { path } = queue.shift()!
    const currentNode = path[path.length - 1]

    if (
      currentNode.job === targetJob &&
      currentNode.machine === targetMachine
    ) {
      foundTarget = true
      const totalProcessingTime = calculateTotalProcessingTime(path)
      if (totalProcessingTime > maxTotalProcessingTime) {
        maxTotalProcessingTime = totalProcessingTime
        longestPath = path.slice(1)
      }
    }

    for (const next of currentNode.nextNode) {
      queue.push({ path: [...path, next] })
    }
  }

  if (!foundTarget) {
    return null
  }

  return longestPath!
}

export const getTotalProcessingTimeOfPath = (
  path: JobNode[] | null
): number | null => {
  if (!path) {
    return null
  }

  return calculateTotalProcessingTime(path)
}

export const createJobGraph = (jobs: Job[]): JobNode => {
  const initNode = (jobIndex: number, machineIndex: number): JobNode => {
    return {
      job: jobIndex,
      machine: machineIndex,
      processingTime: 0,
      nextNode: [],
    }
  }

  const jobGraph: JobNode = initNode(0, 0)

  for (const job of jobs) {
    // console.log(job)

    let currentNode: JobNode = jobGraph

    for (let i = 0; i < job.machineFlow.length; i++) {
      const nextMachine = job.machineFlow[i]
      const processingTime = job.processTimeFlow[i]

      // console.log('nextMachine', nextMachine)
      // console.log('processingTime', processingTime)

      let nextNode: JobNode | undefined

      if (currentNode.nextNode.length === 0) {
        nextNode = initNode(job.jobIndex, nextMachine)
        currentNode.nextNode.push(nextNode)
      } else {
        nextNode = currentNode.nextNode.find(
          (node) => node.machine === nextMachine && node.job === job.jobIndex
        )

        // console.log('nextNode', nextNode?.job, nextNode?.machine)

        if (!nextNode) {
          nextNode = initNode(job.jobIndex, nextMachine)
          // console.log('nextNodeIfUndefined', nextNode?.job, nextNode?.machine)

          currentNode.nextNode.push(nextNode)
        }
      }

      if (nextNode) {
        nextNode.processingTime = processingTime
      }

      currentNode = nextNode
    }
    // consoleLogAll(jobGraph)
  }

  return jobGraph
}

export const calculateLongestPathProcessingTimeToDestination = (
  node: JobNode
): number => {
  if (node === undefined) return 0

  if (node.nextNode.length === 0) {
    return node.processingTime
  }

  let maxProcessingTime = 0
  for (const next of node.nextNode) {
    const nextProcessingTime =
      calculateLongestPathProcessingTimeToDestination(next)
    maxProcessingTime = Math.max(maxProcessingTime, nextProcessingTime)
  }
  return node.processingTime + maxProcessingTime
}

export const updateGraph = (
  jobGraph: JobNode,
  machineIndex: number,
  orderOfJob: number[]
): JobNode => {
  const length = orderOfJob.length
  const newJobNode = jobGraph

  if (length <= 1) return newJobNode

  for (let i = length - 1; i < length && i > 0; i--) {
    const startNode = returnLastElementOfAnArray(
      searchJobNode(newJobNode, orderOfJob[i - 1], machineIndex) || []
    ) as JobNode

    const endNode = returnLastElementOfAnArray(
      searchJobNode(newJobNode, orderOfJob[i], machineIndex) || []
    ) as JobNode

    startNode.nextNode.push(endNode)
  }
  return newJobNode
}
