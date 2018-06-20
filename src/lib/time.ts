/**
 * Resolve a promise after `duration` with `resolveValue` if given
 * @export
 * @template T 
 * @param {number} duration 
 * @param {T} [resolveValue] 
 * @returns {Promise<T>} 
 */
export function delay<T = void>(duration: number, resolveValue?: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(resolveValue), duration)
  })
}