module.exports = function () {
  function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
    hotAddUpdateChunk(chunkId, moreModules);
    if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
  }

  function hotDownloadUpdateChunk(chunkId) {
    console.log('requirep + hotchunk', '$require$.p + $hotChunkFilename$')
    console.log('crossOrigin', '$crossOriginLoading$')
  }

  function hotDownloadManifest(requestTimeout) {
    requestTimeout = requestTimeout || 10000;
    return new Promise(function (resolve, reject) {
      console.log('requestPath', '$require$.p + $hotMainFilename$')
        resolve({})
    })
  }
}
