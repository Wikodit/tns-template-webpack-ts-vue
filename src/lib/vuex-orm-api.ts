import { get, post, patch, destroy } from 'lib/api'
import { Plugin } from '@vuex-orm/core/lib/plugins/use'

const plugin: Plugin = {
  install({ subActions }) {
    subActions.fetch = async ({ dispatch }, { endpoint }) => {
      const { body } = await get(endpoint, { silentFail: true, alwaysResolve: true })
      dispatch('insertOrUpdate', { data: body })
      return true
    }

    // subActions.persist = async ({ dispatch }, { endpoint, payload }) => {
    //   const id = await addRecord(endpoint, payload)
    //   payload.id = id
    //   dispatch('insert', {
    //     data: payload
    //   })
    //   return true
    // }

    // subActions.push = async ({ dispatch }, { endpoint, payload }) => {
    //   const response = await updateRecord(endpoint, payload)
    //   console.log(payload)
    //   console.log(response)
    //   dispatch('update', {
    //     where: payload.id,
    //     data: payload
    //   })
    //   return true
    // }

    // subActions.destroy = async ({ dispatch }, { endpoint, payload }) => {
    //   const success = await deleteRecord(endpoint, payload)
    //   console.log(success)
    //   dispatch('delete', payload.id)
    //   return true
    // }
  }
}

export default plugin