var express = require('express');
const postHelpers = require('../helpers/post-helpers');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')
const verifyLogin =(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
let user=req.session.user
  postHelpers.getAllPost().then((post) => {
    
    res.render('user/index', {post,user});
  })

});

router.get('/add-post', verifyLogin,(req, res) => {

  res.render('user/add-post',{ user: req.session.user});
})
router.post('/add-post', (req, res) => {

  console.log(req.body);
  console.log(req.files.image);

  postHelpers.addPost(req.body, (id) => {
    
    let image = req.files.image
    image.mv('./public/post-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/view-post',{ user: req.session.user})
      } else {
        console.log(err);
      }
    })

  })

});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');

  } else {
    res.render('user/login', { "loginErr": req.session.userLoginErr })
    req.session.userLoginErr = false
  }

  
})

router.get('/signup', (req, res) => {

  res.render('user/signup');


});
router.post('/signup', (req, res) => {
userHelpers.doSignup(req.body).then((response)=>{
  
  // req.session.user = response
  //   req.session.loggedIn = true
    res.redirect('/login')
  })
});
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response)=>{
    if (response.status) {

      req.session.user = response.user
      req.session.loggedIn = true
      res.redirect('/')
    } else {
      req.session.userLoginErr = "Invalid username or password"
      res.redirect('/login')
    }
  })

});
router.get('/logout', (req, res) => {

  req.session.destroy()
  res.redirect('/')
});
router.get('/view-post', verifyLogin,async(req, res) => {
  // let post = await postHelpers.getPost(req.session.user._id)
  // let user=req.session.user._id
  // console.log(post)
  
    // res.render('user/view-post',{post,user, user: req.session.user});
    let user=req.session.user
  postHelpers.getAllPost().then((post) => {
    
    res.render('user/view-post', {post,user,user: req.session.user});
  })
  })
 
router.get('/user/delete-post/:id', verifyLogin, (req, res) => {
  let postId = req.params.id
  console.log(postId);
  postHelpers.deletePost(postId).then((response) => {
    res.redirect('/view-post')
  })

})
router.get('/user/edit-post/:id', verifyLogin, async (req, res) => {
  let post = await postHelpers.getPostDetails(req.params.id)
  res.render('user/edit-post', { post })
})


router.post('/user/edit-post/:id', (req, res) => {
  let id = req.params.id
  postHelpers.updatePost(req.params.id, req.body).then((response) => {
   
    // if (req.files.image) {
    //   let Image = req.files.image
    //   Image.mv('./public/post-images/' + id + '.jpg')
    // }
    res.redirect('/view-post')
  })

});

router.get('/view-profile/:id', async(req, res, next)=> {
  let user = await userHelpers.getuserDetails(req.params.id)
    
  res.render('user/view-profile',{user});


});
router.post('/user/view-profile/:id', (req, res) => {
  
  userHelpers.updateuser(req.params.id, req.body).then((response) => {
   
    res.redirect('/')
  })

});




module.exports = router;
