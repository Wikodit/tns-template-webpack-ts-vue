import { Model } from '@vuex-orm/core'
import { stat } from 'fs';

export default class User extends Model {
  static entity = 'users'

  static fields() {
    return {
      id: this.number(null),
      name: this.string(''),
      email: this.string(''),
      phone: this.string(''),
      website: this.string(''),
      address: this.attr({}),
      company: this.attr({}),
    }
  }
}

/* NESTED FIELDS LIKE BELOW ARE NOT WORKING YET */

// class User extends Model {
//   ...
//     address: this.belongsTo(UserAddress, '_id'),
//     company: this.belongsTo(UserCompany, '_id'),
//   ...
// }

// export class UserAddress extends Model {
//   static entity = 'userAddresses'
//   static primaryKey: '_id'

//   static fields() {
//     return {
//       _id: this.increment(),
//       street: this.string(''),
//       suite: this.string(null),
//       city: this.string(''),
//       zipcode: this.string(''),
//       geo: this.attr(''),
//     }
//   }
// }

// export class UserCompany extends Model {
//   static entity = 'userCompanies'
//   static primaryKey: '_id'

//   static fields() {
//     return {
//       _id: this.increment(),
//       name: this.string(''),
//       catchPhrase: this.string(''),
//       bs: this.string(''),
//     }
//   }
// }