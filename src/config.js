const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.host + (window.location.port ? ':' + window.location.port : '')
}

const version = 'V10.1.1.20200106'

export default {
  version,
  getLocationOrigin
}
