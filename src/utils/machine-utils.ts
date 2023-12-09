import { Job, JobNode, MachineOperation } from '../types'
import {
  calculateLongestPathProcessingTimeToDestination,
  getTotalProcessingTimeOfPath,
  searchJobNode,
} from './job-node-utils'

export const getInitialMakeSpan = (jobNode: JobNode) => {
  return calculateLongestPathProcessingTimeToDestination(jobNode)
}

export const getProcessTime = (
  jobGraph: JobNode,
  jobIndex: number,
  machineIndex: number
) => {
  const pathToNode = searchJobNode(jobGraph, jobIndex, machineIndex)
  if (pathToNode) {
    return pathToNode[pathToNode.length].processingTime
  }
  return null
}

export const getReleaseTime = (
  jobGraph: JobNode,
  jobIndex: number,
  machineIndex: number
) => {
  // console.log(jobGraph, jobIndex, machineIndex)

  const pathToNode = searchJobNode(jobGraph, jobIndex, machineIndex)

  // console.log('pathToNode: ', pathToNode)

  const totalProcessingTimeOfPath = getTotalProcessingTimeOfPath(pathToNode)

  // console.log('totalProcessingTimeOfPath: ', totalProcessingTimeOfPath)

  if (pathToNode && totalProcessingTimeOfPath) {
    return (
      totalProcessingTimeOfPath -
      pathToNode[pathToNode.length - 1].processingTime
    )
  }
  return undefined
}

export const getDueTime = (props: {
  jobGraph: JobNode
  makeSpan: number
  jobIndex: number
  machineIndex: number
}) => {
  const { jobGraph, jobIndex, machineIndex, makeSpan } = props

  const pathToNode = searchJobNode(jobGraph, jobIndex, machineIndex)

  if (pathToNode && pathToNode.length) {
    const _node = pathToNode[pathToNode.length - 1]
    return (
      makeSpan -
      calculateLongestPathProcessingTimeToDestination(_node) +
      _node.processingTime
    )
  }

  return null
}

export const getInitialListOfMachine = (jobs: Job[]): number[] => {
  const machines: number[] = []

  for (const job of jobs) {
    for (const machine of job.machineFlow) {
      if (!machines.some((ele) => ele === machine)) machines.push(machine)
    }
  }

  machines.sort((a, b) => a - b)

  return machines
}

export const getMachineOperation = (
  jobGraph: JobNode,
  machineIndex: number,
  makeSpan: number
): MachineOperation => {
  const machineOperation: MachineOperation = []

  const _getMachineOperation = (
    jobGraphRoot: JobNode,
    jobNode: JobNode,
    makeSpan: number
  ) => {
    const { job, machine, processingTime, nextNode } = jobNode

    if (machine === machineIndex) {
      machineOperation[job - 1] = {
        machineIndex: machine,
        jobIndex: job,
        processingTimes: processingTime,
        releaseTime: getReleaseTime(jobGraphRoot, job, machine) ?? undefined,
        dueDateTime:
          getDueTime({
            jobGraph: jobGraphRoot,
            jobIndex: job,
            machineIndex: machine,
            makeSpan,
          }) ?? undefined,
      }
    }

    if (nextNode.length === 0) return

    for (const node of nextNode) {
      _getMachineOperation(jobGraph, node, makeSpan)
    }
  }

  _getMachineOperation(jobGraph, jobGraph, makeSpan)

  return machineOperation
}
