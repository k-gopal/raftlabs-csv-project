const exportCsvSchema = require("../schema/exportCsvSchema");
const findBookMagazineSchema = require("../schema/findBookMagazine");
const findByAuthorEmailSchema = require("../schema/findByAuthorEmailShema");
const readCsvSchema = require("../schema/readCsvSchema");
const { readAuthors, readBooks, readMagazines, uploadCsvToS3 } = require("../util/common");

const readCsv = async (req, res, next) => {
  try {
    let body = req.body;
    let validation = readCsvSchema.validate(body);

    if (validation.error) {
      res.status(400).send({
        message: "Bad Request Payload.",
        error: validation.error,
      });
    }

    if (body.type.includes("all")) {
      let authors = await readAuthors();
      let books = await readBooks();
      let magazines = await readMagazines();

      res.status(200).send({ authors, books, magazines });
    } else {
      let authors, books, magazines;
      if (body.type.includes("authors")) {
        authors = await readAuthors();
      }
      if (body.type.includes("books")) {
        books = await readBooks();
      }
      if (body.type.includes("magazines")) {
        magazines = await readMagazines();
      }

      res.status(200).send({
        statusCode: 200,
        message: "Data fetched successfully.",
        result: {
          authors: authors?.length && authors,
          books: books?.length && books,
          magazines: magazines?.length && magazines,
        },
      });
    }
  } catch (error) {
    console.log("Error in read csv: ", error);
    res.status(500).send({
      statusCode: 500,
      message: "Intenal Server Error",
      error,
    });
  }
};

const findBookMagazineFunc = async (req, res, next) => {
  try {
    let body = req.body;
    let validation = findBookMagazineSchema.validate(body);

    if (validation.error) {
      res.status(400).send({
        message: "Bad Request Payload.",
        error: validation.error,
      });
    }
    let books = await readBooks();
    let magazines = await readMagazines();
    let bookMagazines = [...books, ...magazines];

    let result = bookMagazines?.filter((ele) => ele.isbn === body.ISBN);

    if (result?.length) {
      res.status(200).send({
        statusCode: 200,
        message: "Data fetched successfully.",
        result,
      });
    } else {
      res.status(404).send({
        statusCode: 404,
        message: "Data not found.",
        result,
      });
    }
  } catch (error) {
    console.log("Error in find book and magazine: ", error);
    res.status(500).send({
      statusCode: 500,
      message: "Intenal Server Error",
      error,
    });
  }
};

const findByAuthorEmailFunc = async (req, res, next) => {
  try {
    let body = req.body;
    let validation = findByAuthorEmailSchema.validate(body);

    if (validation.error) {
      res.status(400).send({
        message: "Bad Request Payload.",
        error: validation.error,
      });
    }
    let books = await readBooks();
    let magazines = await readMagazines();
    let bookMagazines = [...books, ...magazines];

    let result = bookMagazines?.filter((ele) => ele.authors === body.email);

    if (result?.length) {
      res.status(200).send({
        statusCode: 200,
        message: "Data fetched successfully.",
        result,
      });
    } else {
      res.status(404).send({
        statusCode: 404,
        message: "Data not found.",
        result,
      });
    }
  } catch (error) {
    console.log("Error in find by author email: ", error);
    res.status(500).send({
      statusCode: 500,
      message: "Intenal Server Error",
      error,
    });
  }
};

const sortByTitle = async (req, res, next) => {
  try {
    let books = await readBooks();
    let magazines = await readMagazines();

    let booksMagazine = [...books, ...magazines].sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    res.status(200).send({
      statusCode: 200,
      message: "Data sorted.",
      result: booksMagazine,
    });
  } catch (error) {
    console.log("Error in sort by author: ", error);
    res.status(500).send({
      statusCode: 500,
      message: "Intenal Server Error",
      error,
    });
  }
};

const exportCsv = async (req, res, next) => {
  try {
    let body = req.body;
    let validation = exportCsvSchema.validate(body);

    if (validation.error) {
      res.status(400).send({
        message: "Bad Request Payload.",
        error: validation.error,
      });
    }
    let data;
    let pushObj;
    let csvUrl = "https://people.sc.fsu.edu/~jburkardt/data/csv/addresses.csv";
    let finalData;
    if(body.type === 'book'){
        data = await readBooks();
        pushObj= {
            title: body.title,
            isbn: body.isbn,
            authors: body.authors,
            description: body?.description
        }
        finalData = [...data, pushObj];
        // csvUrl = uploadCsvToS3(["title", "isbn", "authors", "description"], finalData);
    } else {
        data = await readMagazines();
        pushObj= {
            title: body.title,
            isbn: body.isbn,
            authors: body.authors,
            publishedAt: body?.publishedAt
        }
        finalData = [...data, pushObj];
        // csvUrl = uploadCsvToS3(["title", "isbn", "authors", "publishedAt"], finalData);
    }

    res.status(200).send({
        statusCode: 200,
        message: "File generated.",
        result: csvUrl,
        demoData: finalData
    });

  } catch (error) {
    console.log("Error in export csv: ", error);
    res.status(500).send({
      statusCode: 500,
      message: "Intenal Server Error",
      error,
    });
  }
};

module.exports = {
  readCsv,
  findBookMagazineFunc,
  findByAuthorEmailFunc,
  sortByTitle,
  exportCsv,
};
