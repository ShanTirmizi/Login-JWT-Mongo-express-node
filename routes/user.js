const verify = require('./verifytoken');
const router = require('express').Router();

router.get('/', verify, async (req, res) => {
  //   res.json({
  //     message: 'Hello World',
  //   });
  res.send(req.user);
});

module.exports = router;
