var express = require('express');
var router = express.Router();
var maria = require('../maria'); 
/* GET home page. */
router.get('/web_manage', function (req, res, next) {
  maria.query('select * from web_manage', function (err, rows, fields) {
      if (!err) {
          console.log(rows);
          var result = JSON.stringify(rows)
          res.send(result);
      } else {
          console.log('query error : ' + err);
          res.send(err);
      }
  });
});


// 로그인 하는 부분
router.get('/', function (req, res, next) {
  res.render('login');
});
router.post('/', function (req, res, next) {
  var web_manage_id = req.body['web_manage_id'];
  var pass_word = req.body['pass_word'];
  maria.query('select * from employee where web_manage_id=? and pass_word=?',[web_manage_id,pass_word], function (err, rows) {
      if (!err) {
          if (rows[0]!=undefined) {
              res.render('index')
          } else {
              res.send('no data');
          }

      } else {
          res.send('error : ' + err);
      }
  });
});
// 회원가입 하는 부분
router.get('/sign_up', function (req, res, next) {
  res.render('sign_up');
});
router.post('/sign_up', function (req, res, next) {
  var employee_name = req.body['employee_name'];
  var ihidnum = req.body['ihidnum'];
  var department_id = req.body['department_id'];
  var web_manage_id = req.body['web_manage_id'];
  var pass_word = req.body['pass_word'];
  var position_id = req.body['position_id'];
  var master_check = req.body['master_check'];
  maria.query('insert into employee(employee_name,ihidnum,department_id,web_manage_id,pass_word,position_id,master_check) values(?,?,?,?,?,?,?)', [employee_name,ihidnum,department_id,web_manage_id,pass_word,position_id,master_check], function (err, rows) {
    if (!err) {
        res.send('success');
    } else {
        res.send('err : ' + err);
    }
  });
});
module.exports = router;