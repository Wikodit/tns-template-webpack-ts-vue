import { APIError } from 'lib/errors'
import { api as apiConfig } from 'config'
import * as dialogs from 'tns-core-modules/ui/dialogs/dialogs'
import store from 'store'
import Vue from 'vue'

export interface ApiOptions {
  bypassAuth?: boolean
  basePath?: string
  baseEndpoint?: string
  method?: string
  etag?: string
  log?: boolean
  logBody?: boolean
  logError?: boolean
  silentFail?: boolean // never show a dialog on error
  alwaysResolve?: boolean // Resolve even if error
  headers?: {[name: string]: string}
}

export interface ApiResponse {
  status: number,
  headers: Headers,
  body ?: any,
}

class Api {
  config: ApiOptions = {}

  constructor (config: ApiOptions = {}) {
    this.config = config
  }

  async parseResponse(response: Response, options: ApiOptions = {}): Promise<ApiResponse> {
    const result: ApiResponse = {
      status: response.status,
      headers: response.headers,
    }

    if ((response.status === 304 && options.etag) || response.status === 204) {
      result.body = void 0 // Enforce empty body
      return result
    }
    
    let data
    try {
      data = await response.json()
    } catch {
      return Promise.reject(new APIError(
        'Le serveur n\'a pas répondu correctement.',
        response.status,
        response.statusText,
      ))
    }

    if (response.status >= 200 && response.status <= 203) {
      result.body = data
      return result
    }

    return Promise.reject(new APIError(
      this._getMessageFromData(data, response.status),
      response.status,
      response.statusText,
    ))
  }

  private _getMessageFromData(data: any, status: number) {
    try {
      if (typeof data === 'object') {
        if (data.message) {
          return data.message
        }

        if (status === 400 && data.data) {
          let msg = ''
          for (const k in data.data) {
            msg += data.data[k].join(' ')
          }
          return msg
        }
      }
    } catch (e) {}
    
    return 'Problème technique...'
  }

  buildHeaders(options: ApiOptions = {}) {
    let defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (!options.bypassAuth && store.getters.credentials) {
      defaultHeaders['Authorization'] = 'token ' + store.getters.credentials.token
    }

    if (options.etag) {
      defaultHeaders['If-None-Match'] = options.etag
      console.log('header' + options.etag)
    }

    return new Headers({ ...defaultHeaders, ...(options.headers || {}) })
  }

  public async request(
    endpoint: string,
    method: string,
    params: any,
    options: ApiOptions = {},
  ): Promise<ApiResponse> {
    const opts = { ...this.config, method, ...options }
    const headers = this.buildHeaders(opts)
    const fetchParams = {
      headers,
      body: params ? JSON.stringify(params) : void 0,
      method: opts.method || 'GET',
    }
    
    const url = `${opts.basePath}${opts.baseEndpoint ? `/${opts.baseEndpoint}` : '' }/${endpoint}`

    return fetch(url, fetchParams).then((response) => {
      return this.parseResponse(response, opts)
    }).then((res) => {
      if (opts.log) {
        console.dir(fetchParams)
        console.log(
          `+@+ ${url} — [${res.status}]` +
          (opts.logBody && res.body && JSON.stringify(res.body)),
        )
      }
      return res
    }).catch((err) => {
      if (err instanceof APIError && err.status === 401) {
        // store.dispatch('lostAuthentication')
      } 
      
      if (!opts.silentFail) {
        dialogs.alert({
          title: 'Une erreur est survenue',
          message: err.message,
          okButtonText: 'OK',
        })
        err && (err.$handled = true)
      }

      if (opts.logError) {
        // console.dir(fetchParams)
        console.log(
          `+@+ ${url} — ` +
          `[${err.status}] ${JSON.stringify(err.body)} - ${JSON.stringify(err.message)}`,
        )
      }
      
      if (!opts.alwaysResolve) {
        return Promise.reject(err)
      }
    })
  }
}

export const api = new Api(apiConfig)

export async function post(endpoint: string, params: any, options: ApiOptions = {}) {
  return api.request(endpoint, 'POST', params, options)
}

export async function patch(endpoint: string, params: any, options: ApiOptions = {}) {
  return api.request(endpoint, 'PATCH', params, options)
}

export async function destroy(endpoint: string, options: ApiOptions = {}) {
  return api.request(endpoint, 'DELETE', null, options)
}

export async function get(endpoint: string, options: ApiOptions = {}) {
  return api.request(endpoint, 'GET', null, options)
}

/**
 * This method uses `splice` and `push` to sync a collection with a new
 * given collection
 * 
 * @export
 * @param {any} collection The source collection
 * @param {any} data The new items
 * @param {string} [options={
 *   idKey: 'id',
 *   cacheKey: '_etag',
 * }] 
 */
export function syncCollection(collection: any[], data: any[], options = {
  idKey: 'id',
  cacheKey: '_etag',
}) {
  const opts = Object.assign({
    idKey: 'id',
    cacheKey: '_etag',
  },                         options)

  const dataById: { [id: number]: any } = {}
  const l = data.length
  for (let i = 0; i < l; i++) {
    dataById[data[i][opts.idKey]] = data[i]
  }

  // 1. Remove outdated items and update items
  for (let i = collection.length; i--;) {
    const item = collection[i]
    const newItem = dataById[item[opts.idKey]]

    if (!newItem) {
      // collection.splice(i, 1)
      Vue.delete(collection, i)
    } else {//if (opts.cacheKey && item[opts.cacheKey] !== newItem[opts.cacheKey]) {
      // collection.splice(i, 1, newItem)
      Vue.set(collection, i, newItem)
    } // @todo could add a way if there is no cacheKey to detect changes anyway

    delete dataById[item[opts.idKey]]
  }

  // 2. Add new items
  for (let i = 0; i < l; i++) {
    if (!dataById[data[i][opts.idKey]]) continue
    Vue.set(collection, collection.length, data[i])
  }
}
