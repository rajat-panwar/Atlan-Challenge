import canUseDom from 'can-use-dom'

export function capitalizeFirstChar (inputString = '') {
    const str = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
    return str.replace('.', '')
}

function isObjectEmpty (obj) {
  return Object.keys(obj || {}).length <= 0
}

const isObject = (error) => error instanceof Object

const setLocalStorageCache = (key, resp = {}, cacheObj = null) => {
  if (!key) {
    return resp
  }
  if (cacheObj) {
    cacheObj[key] = resp
    return
  }
  return window.localStorage.setItem(key, JSON.stringify(resp))
}

const getLocalStorageCache = (key, cacheObj = null) => {
  if (!key) {
    return false
  }
  if (cacheObj) {
    return cacheObj[key]
  }
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (e) {
    return false
  }
}

const removeLocalStorageCache = (key, cacheObj = null) => {
  if (!key) {
    return false
  }
  if (cacheObj) {
    delete cacheObj[key]
    return
  }
  return window.localStorage.removeItem(key)
}

export function asyncMemoize (_promise) {
  let cache = {}
  let cacheKey = ''
  const wrapped = async function (params = {}) {
    let resp = {}
    try {
      if (!canUseDom) {
        return _promise(params)
      }
      cacheKey = JSON.stringify(params)
      let cachedItem = getLocalStorageCache(cacheKey, cache)
      if (cachedItem) {
        return Promise.resolve(cachedItem)
      }
      resp = await _promise(params)
      if (isObject(resp) && isObjectEmpty(resp)) {
        resp = null
      }
      if (!resp) {
        return _promise(params)
      }
      setLocalStorageCache(cacheKey, resp, cache)
      return Promise.resolve(resp)
    } catch (e) {
      return _promise(params)
    }
  }

  const clearCache = () => {
    if (!canUseDom) {
      return true
    }
    removeLocalStorageCache(cacheKey, cache)
    return true
  }
  return [wrapped, clearCache]
}