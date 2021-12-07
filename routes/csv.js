const express = require('express');
const { readCsv, findBookMagazineFunc, findByAuthorEmailFunc, sortByTitle, exportCsv } = require('../controller/csvController');
const router = express.Router();


router.post("/read-csv", readCsv);
router.post("/find-book-magazine", findBookMagazineFunc);
router.post("/find-by-author-email", findByAuthorEmailFunc);
router.get("/sort-by-title", sortByTitle);
router.post("/upload-book-magazine", exportCsv);

module.exports = router;