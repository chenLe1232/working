function fnResize() {
  let deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  if (deviceWidth >= 750) {
    deviceWidth = 750;
  }
  document.documentElement.style.fontSize = `${deviceWidth / 7.5}px`;
}

export default fnResize;
