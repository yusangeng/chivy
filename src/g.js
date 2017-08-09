/**
 * 全局对象
 *
 * @author yusangeng
 */

/**
 * @private
 */
const getGlobal = new Function('return this')

export default getGlobal()
