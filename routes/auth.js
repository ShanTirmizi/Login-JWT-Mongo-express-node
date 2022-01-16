const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
  //   res.send('Register');
  //Validate the data
  //   const validation = await schema.(req.body);
  //   const { error } = await schema.validate(req.body);
  const { error } = await registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Check if user already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exist');

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const newUser = await user.save();
    res.send({ user: newUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  //   res.send('Login');
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Check if user already exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email not found');
  // Validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Password is incorrect');
  // Create and assign a token
  //   const token = user.generateAuthToken();
  // json web token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
  //   res.send('Logged in');
});

module.exports = router;
