export class Reimbursement {
  reimbursementId: number
  author: number
  amount: number
  dateSubmitted: number
  dateResolved: number
  description: string
  resolver: number
  status: number
  type: number
}

export class ReimbursementStatus {
  statusId: number
  status: string
}

export class ReimbursementType {
  typeId: number
  type: string 
}