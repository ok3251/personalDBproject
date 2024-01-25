const pool = require('../../DB/db');

// 메인 페이지 렌더링
exports.main = async(req,res) => {
    res.render('main',{user:req.session.user});
}
// 로그아웃
exports.tryLogout = async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                res.redirect('/main');
            }
        });
    }
}


// 로그인 페이지 렌더링
exports.login = async (req, res) => {
    res.render('login', {logError:{}, regmessage:''});
}
// 로그인 페이지에 들어가는 정보들
exports.trylogin = async (req, res) => {
    try {
        const userId = req.body.userId;
        const userPwd = req.body.userPwd;

        const logError = {};

        const CheckUser = 'SELECT * FROM user WHERE user_id=? AND user_pwd=?';
        const existUser = await pool.query(CheckUser, [userId,userPwd]);

        if (existUser[0].length > 0) {
            console.log('로그인 성공');
            req.session.user = existUser[0][0]
            req.session.save();
            return res.render('main', {user : req.session.user});


        }else {
            logError.exid = '로그인 실패';
        }

        if (Object.keys(logError).length > 0) {
            res.render('login', { logError, regmessage:'' });
            return;
        }

    } catch (error) {
        console.error('오류', error);
        const errorMessage = '오류가 발생했습니다. 다시 시도해주세요.';
        res.render('login', { error: { message: errorMessage } });
    }
};



// 회원가입 페이지 렌더링
exports.register = async (req, res) => {
    res.render('register', {error: {}});
}
// 회원가입 페이지에 들어가는 정보들
exports.tryRegister = async (req, res) => {
    try {
        const nickname = req.body.nickname;
        const id = req.body.id;
        const password = req.body.pwd;
        const passwordcheck = req.body.pwdcheck;

        console.log(nickname, id, password, passwordcheck);

        const error = {};

        const CheckNn = 'SELECT * FROM user WHERE user_nickname=?';
        const CheckNnresult = await pool.query(CheckNn, [nickname]);

        if (CheckNnresult[0].length > 0) {
                error.nickname = '이미 존재하는 닉네임입니다.';
        }
        


        const CheckId = 'SELECT * FROM user WHERE user_id=?';
        const CheckIdresult = await pool.query(CheckId, [id]);
        if (CheckIdresult[0].length > 0) {
            error.id = '이미 존재하는 아이디입니다.';
        }
        if (password !== passwordcheck) {
            error.passwordcheck = '비밀번호가 일치하지 않습니다.';
        }

        if (Object.keys(error).length > 0) {
            res.render('register', { error });
            return;
        }

        newinfo = 'INSERT INTO user (user_id, user_pwd, user_nickname) VALUES (?,?,?)'
        newuser = await pool.query(newinfo, [id,password,nickname]);

        res.render('login',{logError : {}, regmessage:'회원가입이 완료되었습니다.'});
        
    } catch (error) {
        console.error('오류', error);
        const errorMessage = '오류가 발생했습니다. 다시 시도해주세요.';
        res.render('register', { error: { message: errorMessage } });
    }
}

// 메뉴페이지 렌더링
exports.menuselect = async(req, res) =>{
    const coffeeselect = "SELECT * FROM menu WHERE menu_category='coffee'";
    const breadselect = "SELECT * FROM menu WHERE menu_category='bread'";
    const Coffee = await pool.query(coffeeselect);
    const Bread = await pool.query(breadselect);
    const menuName = req.body.menuName;
    console.log('Menu Name:', menuName);
    res.render('menuselect', {Coffee : Coffee[0], Bread : Bread[0], user: req.session.user});
}

// 메뉴 페이지 정보 전달
exports.postmenu = async(req,res) =>{
    const menuName = req.body.menuName;
    console.log('Menu Name:', menuName);
    res.render('menuselect', { user: req.session.user});
}