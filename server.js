const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const HOSTNAME = "localhost";

const server = http.createServer(requestHandler);

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server has been started on http://${HOSTNAME}:${PORT}`);
});

const booksDb = path.join(__dirname, "database", "books.json");
const authorsDb = path.join(__dirname, "database", "authors.json");

function requestHandler(req, res) {
  if (req.url === "/books" && req.method === "GET") {
    getBooks(req, res);
  } else if (req.url === "/books" && req.method === "PUT") {
    updateBooks(req, res);
  } else if (req.url === "/books" && req.method === "DELETE") {
    deleteBooks(req, res);
  } else if (req.url === "/books/author" && req.method === "GET") {
    getBookAuthors(req, res);
  } else if (req.url === "/books/author" && req.method === "POST") {
    addBookAuthor(req, res);
  } else if (req.url === "/books/author" && req.method === "PUT") {
    updateBookAuthor(req, res);
  }
}

// GET /books
function getBooks(req, res) {
  fs.readFile(booksDb, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured while getting books...");
    }
    res.end(data);
  });
}

// PUT /books
function updateBooks(req, res) {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBook = Buffer.concat(body).toString();
    const detailsToUpdate = JSON.parse(parsedBook);
    const bookId = detailsToUpdate.id;

    fs.readFile(booksDb, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error has occured...");
      }

      const booksObject = JSON.parse(books);

      const bookIndex = booksObject.findIndex((book) => book.id === bookId);

      if (bookIndex === -1) {
        res.writeHead(404);
        res.end("The book with that ID was not found!");
        return;
      }

      const updatedBook = { ...booksObject[bookIndex], ...detailsToUpdate };
      booksObject[bookIndex] = updatedBook;

      fs.writeFile(booksDb, JSON.stringify(books), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal server error occured! Book could not be updated",
            })
          );
        }
        res.writeHead(200);
        res.end("Book successfully updated");
      });
    });
  });
}

// DELETE /books
function deleteBooks(req, res) {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBook = Buffer.concat(body).toString();
    const detailsToUpdate = JSON.parse(parsedBook);
    const bookId = detailsToUpdate.id;

    fs.readFile(booksDb, "utf8", (err, books) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error has occured...");
      }

      const booksObject = JSON.parse(books);

      const bookIndex = booksObject.findIndex((book) => book.id === bookId);

      if (bookIndex === -1) {
        res.writeHead(404);
        res.end("The book with that ID was not found!");
        return;
      }

      booksObject.splice(bookIndex, 1);

      fs.writeFile(booksDb, JSON.stringify(booksObject), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal server error occured! Book could not be deleted",
            })
          );
        }
        res.writeHead(200);
        res.end("Book successfully deleted");
      });
    });
  });
}

// GET /books/author
function getBookAuthors(req, res) {
  fs.readFile(authorsDb, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured while getting Authors...");
    }
    res.end(data);
  });
}

// POST /books/author
function addBookAuthor(req, res) {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    const parsedAuthor = Buffer.concat(body).toString();
    const newAuthor = JSON.parse(parsedAuthor);
    console.log(newAuthor);

    fs.readFile(authorsDb, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error just occured while trying to add author...");
      }
      const oldAuthors = JSON.parse(data);
      const allAuthors = [...oldAuthors, newAuthor];

      fs.writeFile(authorsDb, JSON.stringify(allAuthors), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal Server Error! Could not save author to database",
            })
          );
        }
        res.end(JSON.stringify(newAuthor));
      });
    });
  });
}

// PUT /books/author
function updateBookAuthor(req, res) {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    const parsedAuthor = Buffer.concat(body).toString();
    const detailsToUpdate = JSON.parse(parsedAuthor);
    const authorId = detailsToUpdate.id;

    fs.readFile(authorsDb, "utf8", (err, authors) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error just occured while trying to update author...");
      }

      const authorsObj = JSON.parse(authors);
      const authorIndex = authorsObj.findIndex(
        (author) => author.id === authorId
      );

      if (authorIndex === -1) {
        res.writeHead(404);
        res.end("Author with ID not found!");
        return;
      }

      const updatedAuthor = { ...authorsObj[authorIndex], ...detailsToUpdate };
      authorsObj[authorIndex] = updatedAuthor;

      fs.writeFile(authorsDb, JSON.stringify(authorsObj), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal Server Error! Could not update author in database",
            })
          );
        }
        res.writeHead(200);
        res.end("Update successful:)");
      });
    });
  });
}
