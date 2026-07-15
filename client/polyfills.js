/* eslint no-extend-native: 0 */
// core-js comes with Next.js. So, you can import it like below
// import includes from 'core-js/library/fn/string/virtual/includes'
// import repeat from 'core-js/library/fn/string/virtual/repeat'
// import assign from 'core-js/library/fn/object/assign'
// import 'babel-polyfill';
import 'core-js/stable'

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
// Add your polyfills
// This files runs at the very beginning (even before React and Next.js core)
console.log('Load your polyfills')

import assign from 'object-assign'
// String.prototype.includes = includes
// String.prototype.repeat = repeat
Object.assign = assign
