const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.host + (window.location.port ? ':' + window.location.port : '')
}

const version = 'V10.0.1.191224'

export default {
  version,
  getLocationOrigin
}
