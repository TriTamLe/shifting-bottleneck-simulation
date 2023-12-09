import { MachineOperation, MaxLatenessInfo } from '../types'
import { generatePermutations, getMaxNumber } from './number'

export const maxLateness = (
  machineOperation: MachineOperation,
  order: number[]
) => {
  const LatenessArray: number[] = []

  order.forEach((task, index) => {
    const operation = machineOperation[task - 1]
    const { processingTimes = 0, releaseTime = 0, dueDateTime = 0 } = operation

    if (index === 0) {
      return LatenessArray.push(processingTimes + releaseTime - dueDateTime)
    }

    const preOperation = machineOperation[order[index - 1] - 1]
    const { dueDateTime: preDuaDate = 0 } = preOperation
    const preSum = LatenessArray[LatenessArray.length - 1] + preDuaDate
    LatenessArray.push(
      (releaseTime < preSum
        ? preSum + processingTimes
        : processingTimes + releaseTime) - dueDateTime
    )
  })
  return getMaxNumber(LatenessArray)
}

export const removeUndefinedWork = (
  machineOperation: MachineOperation
): number[] => {
  const array: number[] = []
  machineOperation.forEach((operation, index) => {
    if (operation.processingTimes === undefined) return

    array.push(index + 1)
  })
  return array
}

export const generatePermutationsOfDefinedWork = (number: number[]) => {
  const indexMatrix = generatePermutations(number.length)

  return indexMatrix.map((indexArr) =>
    indexArr.map((index) => number[index - 1])
  )
}

export const getMaxLatenessArray = (
  machineOperation: MachineOperation
): MaxLatenessInfo[] => {
  const InvolvedTask = removeUndefinedWork(machineOperation)
  const TaskOrderSituations = generatePermutationsOfDefinedWork(InvolvedTask)

  const ArrayOfMaxLateness: MaxLatenessInfo[] = TaskOrderSituations.map(
    (order) => ({
      machineIndex: machineOperation[order[0] - 1].machineIndex,
      maxLateness: maxLateness(machineOperation, order),
      order: order,
    })
  )

  return ArrayOfMaxLateness
}

export const getMinMaxLateness = (
  maxLatenessInfos: MaxLatenessInfo[]
): MaxLatenessInfo => {
  return maxLatenessInfos.reduce((prev, curr) =>
    prev.maxLateness > curr.maxLateness ? curr : prev
  )
}

export const getMaxMinMaxLateness = (maxLatenessInfos: MaxLatenessInfo[]) => {
  return maxLatenessInfos.reduce((prev, curr) =>
    prev.maxLateness < curr.maxLateness ? curr : prev
  )
}
