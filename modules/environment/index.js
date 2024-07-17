const { devServers } = require('./devServer')

export const getEnvironment = (host = '') => {
  let environment = devServers.env || 'dev'

  if (
    host.includes('preview-p') ||
    host.includes('p.') ||
    host.includes('px') ||
    host.includes('p2.') ||
    host.includes('p3.') ||
    host.includes('p4.') ||
    host.includes('p5.') ||
    host.includes('p6.')
  ) {
    environment = 'pre'
  } else if (host.includes('www.') || host.includes('x.') || host.includes('x-internal.')) {
    environment = 'prod'
  } else if (host.includes('ft') || host.includes('mt') || host.includes('preview-t')) {
    environment = 'test'
  } else if (host.includes('preview')) {
    environment = 'prod'
  } else if (host.includes('p-stress.')) {
    environment = 'stress'
  }

  return environment
}
