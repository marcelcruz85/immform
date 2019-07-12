const express = require('express');
const pdftk = require('node-pdftk');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const app = express();
const util = require('util');

app.use(express.json());

router.post('/:form', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4202');
    const inputPath = `/Users/marcel/Projects/easyForm/client/src/assets/${req.params.form}.pdf`
    console.log(inputPath);
    pdftk
        .input(inputPath)
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