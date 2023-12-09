import { jobs } from './data'
import { MachineOperation, MaxLatenessInfo } from './types'
import {
  consoleLogAll,
  createJobGraph,
  getInitialListOfMachine,
  getInitialMakeSpan,
  getMachineOperation,
  getMaxLatenessArray,
  getMaxMinMaxLateness,
  getMinMaxLateness,
  updateGraph,
  validateInitialJob,
} from './utils'

const main = () => {
  if (!validateInitialJob(jobs)) {
    console.log('Please check your data again')
    return
  }

  const initialJobGraph = createJobGraph(jobs)

  const initialMakeSpan = getInitialMakeSpan(initialJobGraph)

  const listOfAllMachine = getInitialListOfMachine(jobs)

  const machineOperations: MaxLatenessInfo[] = []

  let jobGraph = initialJobGraph
  let listOfMachine = listOfAllMachine
  let makespan = initialMakeSpan
  let i = 1

  while (true) {
    console.log('-----------------------')
    console.log(`loop ${i}`)
    console.log('current makespan: ', makespan)

    console.log('getting the list of machine operation...:')
    const listOfMachineOperation = listOfMachine.map((machineIndex) => {
      // console.log('--calculating machine', machineIndex, 'operation--')
      return getMachineOperation(jobGraph, machineIndex, makespan)
    })

    console.log('calculating the max lateness...')
    const listOfMaxLateness = listOfMachineOperation.map(
      (machineOperation: MachineOperation) => {
        // console.log(
        //   '--calculating max lateness of machine',
        //   machineOperation[0].machineIndex,
        //   '--'
        // )
        return getMaxLatenessArray(machineOperation)
      }
    )

    console.log('getting the min lateness of the loop...')
    const listOfMinMaxLateness = listOfMaxLateness.map((maxLatenessArray) =>
      getMinMaxLateness(maxLatenessArray)
    )

    const _lateness = getMaxMinMaxLateness(listOfMinMaxLateness)

    console.log('the bottle neck', _lateness)

    machineOperations.push(_lateness)

    makespan += _lateness.maxLateness > 0 ? _lateness.maxLateness : 0

    console.log('next loop makespan', makespan)

    if (!(_lateness.maxLateness > 0)) {
      listOfMinMaxLateness.forEach((lateness) => {
        if (lateness.machineIndex !== _lateness.machineIndex)
          machineOperations.push(lateness)
      })
    }
    if (machineOperations.length === listOfAllMachine.length) break

    jobGraph = updateGraph(jobGraph, _lateness.machineIndex, _lateness.order)

    listOfMachine = listOfMachine.filter((machineIndex) => {
      return machineIndex !== _lateness.machineIndex
    })
    i++
  }

  machineOperations.sort((a, b) => a.machineIndex - b.machineIndex)

  console.log('-----------------------')
  console.log('final makespan: ', makespan)
  console.log('list of machine operation', machineOperations)
  console.log('-----------------------')
}
main()
