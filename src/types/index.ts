export type NumberOfWork = number
export type NumberOfMachine = number

export type OrderOfOperation = {
  workIndex: number
  OrderOfMachine: number[]
  OrderOfTime: number[]
}

export type OrderOfWork = number[]

export type MachineOperationInATask = {
  machineIndex: number
  jobIndex: number
  processingTimes: number | undefined
  releaseTime: number | undefined
  dueDateTime: number | undefined
}

export type MachineOperation = MachineOperationInATask[]

export type MaxLatenessInfo = {
  machineIndex: number
  maxLateness: number
  order: number[]
}

//*---------------------------------------------

export type JobNode = {
  job: number
  machine: number
  processingTime: number
  nextNode: JobNode[]
}

export type Job = {
  jobIndex: number //>0
  machineFlow: number[] //each number >0
  processTimeFlow: number[] //each number >0
}
