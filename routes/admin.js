var express = require('express');
var router = express.Router();
const postHelpers = require('../helpers/post-helpers');
const userHelpers = require('../helpers/user-helpers')
/* GET users listing. */
router.get('/', function(req, res, next) {
  postHelpers.getAllUser().then((user) => {
    
    res.render('admin/view-users', {user,admin:true});
  })
 
 
});
router.get('/block-user/:id', (req, res) => {
  let userId = req.params.id
  console.log(userId);
  userHelpers.blockuser(userId).then((response) => {
    res.redirect('/admin/')
  })

})


module.exports = router;
