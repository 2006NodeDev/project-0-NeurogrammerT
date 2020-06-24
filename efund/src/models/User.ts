export class User {
  userId: number //Primary Key
  username: string //Unique
  password: string
  firstName: string
  lastName: string
  email: string
  role: Role

  // constructor(userId: number, username: string, password: string, firstName: string, lastName: string, email: string, role: Role) {
  //   this.userId = userId
  //   this.username = username
  //   this.password = password
  //   this.firstName = firstName
  //   this.lastName = lastName
  //   this.email = email
  //   this.role = role
  // }
}

export class Role {
  roleId: number //Primary Key
  role: string //Unique

  // constructor(roleId: number, role: string) {
  //   this.roleId = roleId
  //   this.role = role
  // }
}