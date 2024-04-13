const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"dennis","password":"abc"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

const usernameMatch= users.filter((user)=>{return user.username===username});
return usernameMatch.length>0
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
   const authUser= users.filter((user)=>{return user.username===username && user.password===password})
   return authUser.length>0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const {username,password}= req.body
  
  if(!username || !password){
    return res.send("Both fields are required")
  }

  if(authenticatedUser(username,password)){
    let accessToken=jwt.sign({
      data: password,
    },
    'access',{expiresIn: 60* 60})

    req.session.authorization = {
      accessToken,username
  }
    return res.status(200).send("User successfully logged in");
  }
  else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review successfully deleted");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
