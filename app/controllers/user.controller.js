const User = require("../models/user.model");

// Create and Save a new User
exports.create = (req, res) => {
  // Get user information from request
  const user = new User(req.body);

  User.init()
    .then(async () => {
      try {
        // Save the user to db, generate a token and send it back as response
        const token = await user.newAuthToken();
        if (token.error == true) {
          console.log("Error_True", token);
        }
        if (token.error == false) {
          console.log("Error_False", token);
        }
        res.status(201).send({ token });
      } catch (error) {
        res.status(400).send(error);
      }
    })
    .catch(error => {
      res.status(400).send(error);
    });
};

// Login a user
exports.login = async (req, res) => {
  // Get user information from request
  const requestUser = new User(req.body);
  try {
    let user = await requestUser.checkValidCredentials(
      req.body.email,
      req.body.password
    );
    if (user.error == true) {
      console.log("In failed");
      res.status(201).send({ token: user });
    }
    if (user.error == false) {
      console.log("in success");
      const loginToken = await user.results.newAuthToken();
      res.status(201).send({ token: { loginToken, user } });
    }
  } catch (error) {
    console.log("in Error", error);
    res.status(400).send({ error });
  }
};

// Log user out
exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.status(201).send({ error: false, results: "LOGGED OUT!" });
  } catch (error) {
    res.status(500).send({ error });
  }
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.find()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes."
      });
    });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  let user = req.user;
  res.status(201).send({ error: false, results: user });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  // if(!req.body.content) {
  //     return res.status(400).send({
  //         message: "Note content can not be empty"
  //     });
  // }

  // Find user and update it with the request body
  User.findByIdAndUpdate(
    req.params.userId,
    {
      title: req.body.title || "Untitled Note",
      content: req.body.content
    },
    { new: true }
  )
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      res.send(note);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      return res.status(500).send({
        message: "Error updating note with id " + req.params.noteId
      });
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId
        });
      }
      res.send({ message: "User deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Could not delete user with id " + req.params.userId
      });
    });
};
