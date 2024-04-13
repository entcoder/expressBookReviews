const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


function findBookByAuthor(author) {
  const foundBooks = [];
  for (const id in books) {
      if (books.hasOwnProperty(id)) {
          if (books[id].author.toLowerCase() === author.toLowerCase()) {
              foundBooks.push({ id, ...books[id] });
          }
      }
  }
  return foundBooks;
}

function findBooksByTitle(title){
    const foundBooks=[]
    for(const id in books){
      if(books.hasOwnProperty(id)){
        if(books[id].title.toLowerCase()===title.toLowerCase()){
          foundBooks.push({id, ...books[id]})
        }
      }
    }
    return foundBooks;
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password}= req.body
  if(!username){
    return res.status(400).json({message: "username is required"})
  }

  if(!password){
    return res.status(400).json({message: "password is required"})
  }

  if(!users.includes(username)){
    users.push({"username": username, "password":password})
    res.status(200).json({message:"User regestered successfully"})
  }
  else{
    res.status(404).json({message:"User already exists"})
  }


  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const ISBN= req.params.isbn
  return res.send(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const author = req.params.author;
    const booksByAuthor = findBookByAuthor(author);
    
    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).send('No books found for the author.');
    }

  
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title=req.params.title

  const booksByTitle= findBooksByTitle(title)

  if(booksByTitle.length>0){
    res.status(200).send(booksByTitle)
  }
  else{
    
    res.status(404).json({message:"No books found for this author"})
  }
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const ISBN= req.params.isbn

  return res.status(200).send(books[ISBN].reviews)
  
});

module.exports.general = public_users;


//Task from 10

//task-10

public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;

  
  findBookByISBN(ISBN)
    .then(book => {
      if (book) {
        
        return res.status(200).json(book);
      } else {
        
        return res.status(404).json({ error: "Book not found" });
      }
    })
    .catch(error => {
      
      console.error("Error fetching book:", error);
      return res.status(500).json({ error: "Failed to fetch book" });
    });
});


function findBookByISBN(ISBN) {
  return new Promise((resolve, reject) => {
    
    const book = books[ISBN];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
}


//Task 11

function getBookFromISBN(isbn){
  let book_ = books[isbn];  
  return new Promise((resolve,reject)=>{
    if (book_) {
      resolve(book_);
    }else{
      reject("Unable to find book!");
    }    
  })
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookFromISBN(isbn).then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  )
 });


 //Task 12

 function getBookFromAuthor(author){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBookFromAuthor(author)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

//Task 13

function getBookFromTitle(title){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBookFromTitle(title)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});
