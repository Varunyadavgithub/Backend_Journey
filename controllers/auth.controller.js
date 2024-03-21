// I need to write a controller / Logic to register a user

const bcrypt = require("bcryptjs");
const user_model = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret = require("../configs/auth.config");

/* ---------------------------- Logic to SignUp(create a user) ----------------------------- */

exports.signup = async (req, res) => {
  // 1. read the request body
  const request_body = req.body;

  // 2. Insert the data in the users collection in mongoDB
  const userObj = {
    name: request_body.name,
    userId: request_body.userId,
    email: request_body.email,
    userType: request_body.userType,
    password: bcrypt.hashSync(request_body.password, 8),
  };

  try {
    const user_created = await user_model.create(userObj);

    const res_obj = {
      name: user_created.name,
      userId: user_created.userId,
      email: user_created.email,
      userType: user_created.userType,
      createdAt: user_created.createdAt,
      updatedAt: user_created.updatedAt,
    };
    res.status(201).send(res_obj);
  } catch (err) {
    console.log("Error while registering the user", err);
    res.status(500).send({
      message: "Some error happen while registering the user",
    });
  }
  // 3. Return the response back to the user
};

/* ---------------------------- Logic to SignIn(login/gaining access to the account) ----------------------------- */

exports.signin = async (req, res) => {
  // Check if the user ID is present in the system
  const user = await user_model.findOne({ userId: req.body.userId });

  if (user === null) {
    return res.status(400).send({
      message: "User ID passed is not valid user ID",
    });
  }

  // Password is correct
  const isPasswordValid = bcrypt.compare(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({
      message: "Wrong password passed",
    });
  }

  // using jwt we will create the acces token with a given TTL and return
  const token = jwt.sign({ id: user.userId }, secret.secret, {
    expiresIn: 120,
  });
  
  res.status(200).send({
    name: user.name,
    userId: user.userId,
    email: user.email,
    userType: user.userType,
    accessToken: token
  })
};
