import BaseError from './base-error'

/**
 * Error from API
 * 
 * @export
 * @class APIError
 * @extends {Error}
 */
export default class APIError extends BaseError {
  /**
   * Status code of the request
   * 
   * @type {number}
   * @memberof APIError
   */
  status: number

  /**
   * Code error
   * 
   * @type {string}
   * @memberof APIError
   */
  code: string
  
  /**
   * Creates an instance of APIError.
   * 
   * @param {any} message 
   * @param {any} [status] 
   * @param {any} [code] 
   * @memberof APIError
   */
  constructor(message, status?, code?) {
    super(message)
    this.status = status
    this.code = code
  }
}
