const express = require('express');
const pdftk = require('node-pdftk');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const app = express();
const util = require('util');

app.use(express.json());

router.post('/ar-11', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    pdftk
        .input('/Users/marcel/Projects/immTest/ar-11_editable.pdf')
        .fillForm(req.body)
        .flatten()
        .output('/Users/marcel/Projects/immTest/out.pdf')
        .then(buf => {
            res.type('application/pdf');
            res.send(buf);
        })
        .catch(next);
  });
  
  module.exports = router;