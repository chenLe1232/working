export const handleFullScreen = (element) => {
    // 兼容获取已全屏的节点
    const fullscreenEle = document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;
    if (fullscreenEle && fullscreenEle === element) {
      const exitMethod = document.exitFullscreen || //W3C
        document.mozCancelFullScreen || //FireFox
        document.webkitExitFullscreen || //Chrome
        document.webkitExitFullscreen; //IE
      if (exitMethod) {
        exitMethod.call(document)
      }
    } else {
      const fullScreenMethod = element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;
      if (fullScreenMethod) {
        fullScreenMethod.call(element)
      }
    }
  }