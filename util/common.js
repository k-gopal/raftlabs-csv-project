const csv = require("csvtojson");
const request = require("request");
const AWS = require("aws-sdk");
const { Parser } = require("json2csv");

const readAuthors = async () => {
  let authors = [];
  await csv()
    .fromStream(
      request.get(
        "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/authors.csv"
      )
    )
    .subscribe((json) => {
      // console.log(json['email;firstname;lastname'])
      let row = json["email;firstname;lastname"];
      let jsonArr = row.split(";");
      let pushObj = {
        email: jsonArr[0],
        firstName: jsonArr[1],
        lastName: jsonArr[2],
      };
      authors.push(pushObj);
    });

  return authors;
};

const readBooks = async () => {
  let books = [];
  await csv()
    .fromStream(
      request.get(
        "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv"
      )
    )
    .subscribe((json) => {
      let row = json["title;isbn;authors;description"];
      let jsonArr = row.split(";");
      let pushObj = {
        title: jsonArr[0],
        isbn: jsonArr[1],
        authors: jsonArr[2],
        description: jsonArr[3],
      };
      books.push(pushObj);
    });

  return books;
};

const readMagazines = async () => {
  let magazines = [];
  await csv()
    .fromStream(
      request.get(
        "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv"
      )
    )
    .subscribe((json) => {
      let row = json["title;isbn;authors;publishedAt"];
      let jsonArr = row.split(";");
      let pushObj = {
        title: jsonArr[0],
        isbn: jsonArr[1],
        authors: jsonArr[2],
        publishedAt: jsonArr[3],
      };
      magazines.push(pushObj);
    });

  return magazines;
};

const uploadCsvToS3 = async (fields, csvData) => {
  const s3 = new AWS.S3({
    accessKeyId: "1234567890",
    secretAccessKey: "123456789",
  });

  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const data = parser.parse(csvData);

    const params = {
      Bucket: "test",
      Key: "newFile.csv",
      Body: JSON.stringify(data, null, 2),
    };

    s3.upload(params, function (s3Err, res) {
      if (s3Err) return s3Err;
      return res.location;
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = {
  readAuthors,
  readBooks,
  readMagazines,
  uploadCsvToS3,
};
