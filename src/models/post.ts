import { Model } from '@vuex-orm/core'
import User from 'models/User'

export default class Post extends Model {
  static entity = 'posts'

  static fields() {
    return {
      id: this.number(null),
      userId: this.number(null),
      title: this.attr(''),
      body: this.attr(''),
      user: this.belongsTo(User, 'userId')
    }
  }
}