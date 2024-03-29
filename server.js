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

function requestHandler(req, res) {
  if (req.url === "/books" && req.method === "GET") {
    getBooks(req, res);
  } else if (req.url === "/books" && req.method === "PUT") {
    updateBooks(req, res);
  } else if (req.url === "/books" && req.method === "DELETE") {
    deleteBooks(req, res);
  } else if (req.url === "/books/author" && req.method === "GET") {
    getBookAuthors(req, res);
  }
}

// GET /books
function getBooks(req, res) {
  fs.readFile(booksDb, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error has occured...");
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

function getBookAuthors(req, res){
    fs.readFile(booksDb, "utf8", (err, data)=> {
        
    })
}