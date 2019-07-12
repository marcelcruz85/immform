const express = require('express');
const pdftk = require('node-pdftk');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const app = express();

const util = require('util');

app.use(express.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/form', (req, res, next) => {

  // res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
  
  res.json({ title: 'Express' });
})

router.get('/test', (req, res, next) => {
  const exec = util.promisify(require('child_process').exec);
  async function extractFields() {
    await exec('pdftk /Users/marcel/Projects/immTest/ar-11_editable.pdf dump_data_fields')
    .then(resp => {
      let fieldsArr = []
      console.log(resp.stdout);
        const formFields = resp.stdout.toString().split('---'); 
        formFields.forEach(field => {
          const fieldAttr = field.toString().split('\n');
          if(fieldAttr != ''){
            const formFieldObj = {};
            fieldAttr.forEach(prop => {
              const propName = prop.toString().split(':')[0];
              const propVal = prop.toString().split(':')[1];
              formFieldObj[propName] = propVal;
            })
            fieldsArr.push(formFieldObj);
          }
        });
      res.json(fieldsArr);
    })
    .catch(err => {
      console.log(err);
      res.json({Error: 'Error Saving this PDF'});
    });
  }
  extractFields();
})

router.post('/upload', function (req, res) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var saveTo = path.join('.', filename);
    console.log('Uploading: ' + saveTo);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on('finish', function() {
    console.log('Upload complete');
    res.writeHead(200, { 'Connection': 'close' });
    res.end("That's all folks!");
  });
  return req.pipe(busboy);

});


router.post('/ar-11', (req, res, next) => {

  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
  // res.json(req.body);
  pdftk
      .input('/Users/marcel/Projects/easyForm/client/src/assets/g-28_editable.pdf')
      .fillForm(req.body)
      .flatten()
      .output('/Users/marcel/Projects/immTest/out.pdf')
      .then(buf => {
          res.type('application/pdf'); // If you omit this line, file will download
          res.send(buf);
      })
      .catch(next);
});

module.exports = router;
