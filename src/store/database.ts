import VuexORM, { Database } from '@vuex-orm/core'
import vuexOrmApi from 'lib/vuex-orm-api'

import User from 'models/user'
import Post from 'models/post'

// import userModule from './modules/user'
// import postModule from './modules/post'

VuexORM.use(vuexOrmApi)

const database = new Database()

database.register(User, {}) // {} represent a really basic Vuex module
database.register(Post, {}) // {} represent a really basic Vuex module

export default database