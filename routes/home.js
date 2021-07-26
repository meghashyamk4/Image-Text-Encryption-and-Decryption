const path = require('path');
const CryptoJS = require("crypto-js");
const express = require('express');
const { createWorker } = require('tesseract.js');

const worker = createWorker({
  logger: m => console.log(m)
});

const encrypt = (res) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(res));
};

const decrypt = (data) => {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

// function encrypt(result) {
//   var encodedString = window.btoa( result );
//   return encodedString;
// }
var link;
var result;
var encoded;
const rootDir = require('../util/path');

const router = express.Router();
router.get('/', (req, res, next) => {
  res.render(path.join(rootDir, 'views', 'home.ejs'));
});

router.post('/', (req, res) => {
  link = req.body.title;
  res.redirect('/wait');
});
router.get('/wait', (req, res) => {
  (async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(link);
    console.log(text);
    result = text;
    await worker.terminate();
    res.redirect('/results');
  })();

});
router.get('/results', (req, res, next) => {
  res.render(path.join(rootDir, 'views', 'results.ejs'),{text: result,url: link});
});
router.get('/encrypt', (req, res, next) => {
  encoded = encrypt(result);
  res.render(path.join(rootDir, 'views', 'encrypt.ejs'),{text: encoded});
});
router.get('/decrypt', (req, res, next) => {
  var decrypted = decrypt(encoded);
  res.render(path.join(rootDir, 'views', 'decrypt.ejs'),{text: decrypted});
});
exports.routes = router;