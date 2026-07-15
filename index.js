// jest.setup.js
// import { setConfig } from 'next/config'
// import config from './next.config'

// Make sure you can use "publicRuntimeConfig" within tests.
// setConfig(config.publicRuntimeConfig)

  
const { setConfig } = require('next/config')
setConfig(require('./next.config'))

require('./app')