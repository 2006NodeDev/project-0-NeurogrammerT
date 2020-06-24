export class Reimbursement {
  reimbursementId: number // primary key
  author: number  // foreign key -> User, not null
  amount: number  // not null
  dateSubmitted: number // not null
  dateResolved: number // not null
  description: string // not null
  resolver: number // foreign key -> User
  status: number // foreign key -> ReimbursementStatus, not null
  type: number // foreign key -> ReimbursementType

  // constructor(reimbursementId: number, author: number,
  //   amount: number, dateSubmitted: number, dateResolved: number, description: string, resolver: number, status: number, type: number) {

  //     this.reimbursementId = reimbursementId,
  //     this.author = author,
  //     this.amount = amount,
  //     this.dateSubmitted = dateSubmitted,
  //     this.dateResolved = dateResolved,
  //     this.description = description,
  //     this.resolver = resolver,
  //     this.status = status,
  //     this.type = type
  // }
}

export class ReimbursementStatus {
  statusId: number // primary key
  status: string // not null, unique

  // constructor(statusId: number, status: string) {
  //   this.statusId = statusId,
  //   this.status = status
  // }
}

export class ReimbursementType {
  typeId: number // primary key
  type: string // not null, unique

  // constructor(typeId: number, type: string) {
  //   this.typeId = typeId,
  //   this.type = type
  // }
}