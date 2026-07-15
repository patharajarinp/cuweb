import api from '../utils/api';
import { i18n } from './i18n'

const formatDate = (date, use_option = true) => {
  // var d = new Date(date)
  // var lang = 'en-US'
  // if ((i18n.language || window.localStorage.i18nextLng || 'th') == "th") {
  //   lang = 'th-TH'
  // }

  // if (use_option) {
  //   var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  //   return d.toLocaleDateString(lang, options);
  // }
  // else {
  //   var options = { year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  //   return d.toLocaleDateString(lang, options).replace(/\//g, '-');
  // }
}

export default {
  formatDate,
}