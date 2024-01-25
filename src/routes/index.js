var express = require('express');
var router = express.Router();
const indexCtrl = require('../controller/controller.js');

// 메인페이지
router.get('/main', indexCtrl.main);
router.post('/main', indexCtrl.tryLogout);

// 로그인페이지
router.get('/login',indexCtrl.login);
router.post('/login', indexCtrl.trylogin);

// 회원가입
router.get('/register', indexCtrl.register);
router.post('/register',indexCtrl.tryRegister);

// 메뉴 보기
router.get('/menuselect', indexCtrl.menuselect);
router.post('/menuselect', indexCtrl.menuselect);



module.exports = router;