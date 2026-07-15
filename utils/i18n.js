const NextI18Next = require('next-i18next').default
// const { localeSubpaths } = require('next/config').publicRuntimeConfig
const { initReactI18next } = require('react-i18next');

const languages = ['th', 'en'];
const defaultLanguage = 'th';
const ab = new NextI18Next({
  use: [initReactI18next],
  defaultNS: 'translations',
  fallbackLng: defaultLanguage,
  browserLanguageDetection: false,
  serverLanguageDetection: false,
  defaultLanguage,
  otherLanguages: ['en'],
  localeDetection: false,
  // debug: true,

  localeSubpaths: {
    en: 'en'
  },
  strictMode: false,
  // shallowRender: true,
  //keySeparator: false,
  localePath: typeof window === "undefined" ? 'public/json' : 'json',
  // backend:{
  //   loadPath: `${process.env.api_url}/translations/{{lng}}/{{ns}}` ||"http://192.168.1.111:8080/translations/{{lng}}/{{ns}}",
  //   referenceLng: "th"
  // },
})

ab.languages = languages;

// เช็คและตั้งค่าภาษาเริ่มต้นให้ตรงกับภาษาที่เลือกใน i18n เพื่อป้องกันปัญหาเรื่องการเลือกภาษาผิดพลาด
if (ab.i18n) {
  if (!ab.i18n.language) {
    ab.i18n.language = defaultLanguage;
  }
  if (!Array.isArray(ab.i18n.languages) || ab.i18n.languages.length === 0) {
    ab.i18n.languages = [ab.i18n.language, ...languages.filter((lng) => lng !== ab.i18n.language)];
  }
}

module.exports = ab