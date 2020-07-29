const { create } = require('../controllers/UsersController');


//using register
module.exports = router => {
  router.post('/register', create);
};