const openUrl = (url = '', behaviour = '', options = '') => {
  const baseUrl = window.location.origin;
  const weburl = `${baseUrl}${url}`;
  const webBehaviour = behaviour ?? '_blank';
  const webOptions = options ?? 'toolbar=no, titlebar=no, location=no, directories=no, status=no, menubar=no, copyhistory=yes';
  return window.open(weburl, webBehaviour, webOptions);
}

export {
  openUrl,
};