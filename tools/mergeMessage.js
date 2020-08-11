const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');


const appPath = path.join(process.cwd(), 'app');
const MESSAGES_PATTERN = `${appPath}/i18n/app/**/*.json`;
const LANG_DIR = `${appPath}/i18n/lang`;

const supportedLanguage = ['zh-HK', 'ko'];

const ksort = (obj) => {
  const keys = Object.keys(obj).sort();
  return keys.reduce((collection, item) => {
    collection[item] = obj[item];
    return collection;
  }, {});
};

const jsonFiles = glob.sync(MESSAGES_PATTERN)
  .filter((filename) => {
    const path = filename.replace('/i18n/app', '').replace('.json', '.js');
    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path, 'utf8');
      return content.match(/defineMessages/);
    }
    return false;
  })
  .map(filename => {
      return fs.readFileSync(filename, 'utf8')
  })
  .map(JSON.parse);

const defaultMessages = jsonFiles
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (collection.hasOwnProperty(id)) {
        console.error(`Duplicate message id: ${id}`);
      }
      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

const chineseMessages = jsonFiles
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, description }) => {
      if (collection.hasOwnProperty(id)) {
        console.error(`Duplicate message id: ${id}`);
      }
      collection[id] = description;
    });

    return collection;
  }, {});

const englishMessages = jsonFiles
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (collection.hasOwnProperty(id)) {
        console.error(`Duplicate message id: ${id}`);
      }
      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

const processOtherLanguage = languages => languages.forEach((language) => {
  const languageFilePath = `${LANG_DIR}/${language}.js`;

  const otherLanguageMessages = fs.existsSync(languageFilePath) ? JSON.parse(fs.readFileSync(languageFilePath, 'utf8')) : {};

  const prefix = '（待翻译）';

  Object.keys(chineseMessages)
    .forEach((messageId) => {
      if (!otherLanguageMessages[messageId] ||
        (otherLanguageMessages[messageId] && String(otherLanguageMessages[messageId]).match(prefix))
      ) {
        otherLanguageMessages[messageId] = `${prefix}${englishMessages[messageId]}`;
      }
    });

  fs.writeFileSync(languageFilePath, JSON.stringify(ksort(otherLanguageMessages), null, 2));
});

// 删除不存在的jsx文件的json
const removeRedundantFile = () => glob.sync(MESSAGES_PATTERN)
  .filter((filename) => {
    const path = filename.replace('/i18n/app', '').replace('.json', '.js');
    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path, 'utf8');
      return !content.match(/defineMessages/);
    }
    return true;
  })
  .map(fs.unlinkSync);

// Create directory for language files
mkdirp.sync(LANG_DIR);

// Create default language file (en.js) from defaultMessage field
fs.writeFileSync(`${LANG_DIR}/en.js`, JSON.stringify(ksort(defaultMessages), null, 2));

// Create Chinese language file (zh.js) from description field
fs.writeFileSync(`${LANG_DIR}/zh-CN.js`, JSON.stringify(ksort(chineseMessages), null, 2));

// Process other language file for translators
processOtherLanguage(supportedLanguage);

// removeRedundantFile();
