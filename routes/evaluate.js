const express = require("express");
const { response } = require("../app");
const router = express.Router();
const maria = require("../maria");
const template = require('./template.js');
const axios = require('axios');

/* 평가 관련 컨트롤러 */
/* "/evaluate" */

// 평가 조회 화면으로 이동
router.get("/", function (req, res, next) {
  res.render("evaluate/search");
});

router.get('/evaluate_avg', function(req, res, next) {
  const employee_id = req.query.employee_id;
  const list = req.query.list;

  console.log(employee_id);
  console.log(list);

  if (employee_id) {
    if (list=='업무수행') {
      //이름
      var sql = 'SELECT employee_name FROM employee WHERE employee_id ="' + employee_id + '" ;'

      //동료평가
      var sql1_1 = 'SELECT count(*) count FROM employee_evl e join employee_p_evl p on e.employee_evl_id = p.employee_p_evl_id where e.employee_id ="' + employee_id + '";';
      var sql1_2 = 'SELECT avg(employee_duty_grade) avg FROM employee_evl e join employee_p_evl p on e.employee_evl_id = p.employee_p_evl_id where e.employee_id ="' + employee_id + '";';

      //PM평가
      var sql2_1 = 'SELECT count(*) count FROM pm_evl WHERE employee_id="'+employee_id+'";';
      var sql2_2 = 'SELECT avg(pm_duty_grade) avg FROM pm_evl WHERE employee_id="'+employee_id+'";';
      
      //고객평가
      var sql3_1 = 'SELECT count(*) count FROM customer_evl WHERE employee_id="'+employee_id+'";';
      var sql3_2 = 'SELECT avg(customer_duty_grade) avg FROM customer_evl WHERE employee_id="'+employee_id+'";';     

    } else if (list=='커뮤니케이션') {
      //이름
      var sql = 'SELECT employee_name FROM employee WHERE employee_id ="' + employee_id + '" ;'

      //동료평가
      var sql1_1 = 'SELECT count(*) count FROM employee_evl e join employee_p_evl p on e.employee_evl_id = p.employee_p_evl_id where e.employee_id ="' + employee_id + '";';
      var sql1_2 = 'SELECT avg(employee_cmnct_grade) avg FROM employee_evl e join employee_p_evl p on e.employee_evl_id = p.employee_p_evl_id where e.employee_id ="' + employee_id + '";';

      //PM평가
      var sql2_1 = 'SELECT count(*) count FROM pm_evl WHERE employee_id="'+employee_id+'";';
      var sql2_2 = 'SELECT avg(pm_cmnct_grade) avg FROM pm_evl WHERE employee_id="'+employee_id+'";';

      //고객평가
      var sql3_1 = 'SELECT count(*) count FROM customer_evl WHERE employee_id="'+employee_id+'";';
      var sql3_2 = 'SELECT avg(customer_cmnct_grade) avg FROM customer_evl WHERE employee_id="'+employee_id+'";';
      
    }

    maria.query(sql+sql1_1+sql1_2+sql2_1+sql2_2+sql3_1+sql3_2, function (err, rows) {
      var sql_result = rows[0]
      var sql1_result = rows[1]
      var sql2_result = rows[2]
      var sql3_result = rows[3]
      var sql4_result = rows[4]
      var sql5_result = rows[5]
      var sql6_result = rows[6]
  
      if (err) console.error("err : " + err);
        
      console.log("rows : " + JSON.stringify(rows[0]));
      console.log("rows : " + JSON.stringify(rows[1]));
      console.log("rows : " + JSON.stringify(rows[2]));
      console.log("rows : " + JSON.stringify(rows[3]));
      console.log("rows : " + JSON.stringify(rows[4]));
      console.log("rows : " + JSON.stringify(rows[5]));
      console.log("rows : " + JSON.stringify(rows[6]));
      
      res.render('evaluate/evaluate_avg', {rows: [sql_result,sql1_result,sql2_result,sql3_result,sql4_result,sql5_result,sql6_result],});
    })
  }
  else {
    res.render('evaluate/evaluate_avg')
  }
  
});


router.get('/search', function (req,res,next) {
  var employee_id = req.query.employee_id;
  var project_id = req.query.project_id;
  //SQL query 부분
  //고객 평가 조회
  var sql_c = 'select * from customer_evl where employee_id ="' + employee_id + '" && project_id ="' + project_id + '" ;';
  //PM 평가 조회
  var sql_p = 'select * from pm_evl where employee_id ="' + employee_id + '" && project_id ="' + project_id + '" ;';
  //동료 평가 조회
  var sql_e = 'select e.employee_evl_id, p.employee_p_evl_id, e.employee_id AS emp_evl_id, p.employee_id AS emp_p_evl_id, \
  e.employee_duty_grade, e.employee_duty_evl_content, \
  e.employee_cmnct_grade, e.employee_cmnct_evl_content, e.employee_evl_start, e.project_id \
  from employee_evl e join employee_p_evl p on e.employee_evl_id = p.employee_p_evl_id \
  where e.employee_id ="' + employee_id + '" and e.project_id="' + project_id + '";'

  //평가자 이름 조회
  var sql = 'select employee_name from employee where employee_id ="' + employee_id + '" ;'
  
  maria.query(sql_c+sql_p+sql_e+sql, function(err, rows, fields) { // 쿼리문을 이용해 데이터를 가져온다.
    var sql_c_result = rows[0]
    var sql_p_result = rows[1]
    var sql_e_result = rows[2]
    var sql = rows[3]
    if(!err) { // 에러가 없다면
      // res.send([sql_c_result,sql_p_result,sql_e_result,sql]);
      res.render("evaluate/search", {
        evaluates : [sql_c_result,sql_p_result,sql_e_result,sql],});
    } else { // 에러가 있다면?
      console.log("err : " + err);
      res.send(err); // console 창에 에러를 띄워주고, 에러를 보내준다.
    }
  });
});


//직원 평가 정보 삽입 페이지
router.get("/submit_e", function (req, res, next) {
  res.render("evaluate/evaluate_e_insert");
});

//직원 평가 정보 삽입 페이지 > 삽입
router.post('/submit_e/insert', function(req, res, next) {
  try{
    const e = req.body;
    const sql = 'INSERT INTO employee_p_evl (employee_p_evl_id,employee_id,project_id) values ';
    const sqlValue = `("${e.employee_evl_id}","${e.employee_p_id}","${e.project_id}");`; 
    const sql1 = 'INSERT INTO employee_evl (employee_evl_id,employee_duty_grade,employee_duty_evl_content,employee_cmnct_grade,employee_cmnct_evl_content,employee_evl_start,employee_id,project_id) values ';
    const sqlValue1 = `("${e.employee_evl_id}", "${e.employee_duty_grade}", "${e.employee_duty_evl_content}","${e.employee_cmnct_grade}", 
    "${e.employee_cmnct_evl_content}","${e.employee_evl_start}","${e.employee_id}", "${e.project_id}");`;        
    maria.query(sql1+sqlValue1+sql+sqlValue, function(err, rows, fields) {
        if(!err) {
            res.json(true);
        } else {
            console.log(err);
            res.json(false);
        }
    });
} catch (e) {
    console.log(e);
    res.json(false);
  }
});

//직원 평가 정보 수정 페이지
router.get("/update_e", function (req, res, next) {
  res.render("evaluate/evaluate_e_update");
});

//직원 평가 정보 수정 페이지 > 수정
router.post('/update_e/modify', function(req, res, next) {
  try{
    const e = req.body;
    const sql = 'update employee_evl set employee_duty_evl_content="' 
    + e.employee_duty_evl_content+'",employee_cmnct_grade="' + e.employee_cmnct_grade+'",employee_cmnct_evl_content="' 
    + e.employee_cmnct_evl_content+'", employee_evl_start="' + e.employee_evl_start+'",project_id="'+ e.project_id +'",employee_id="'+e.employee_id+'" where employee_evl_id="'+e.employee_evl_id+'";'  
    const sql1 = 'update employee_p_evl set employee_id="' + e.employee_p_id +'",project_id="' +e.project_id +'" where employee_p_evl_id="' +e.employee_p_evl_id +'";'
    maria.query(sql+sql1, function(err, rows, fields) {
        if(!err) {
            res.json(true);
        } else {
            console.log(err);
            res.json(false);
        }
    });
} catch (e) {
    console.log(e);
    res.json(false);
}
});

//고객 평가 정보 삽입 페이지
router.get("/submit_c", function (req, res, next) {
  res.render("evaluate/evaluate_c_insert");
});

//고객 평가 정보 삽입 페이지 > 삽입
router.post('/submit_c/insert', function(req, res, next) {
  try{
    const c = req.body;
    const sql = 'INSERT INTO customer_evl (customer_evl_id,customer_duty_grade,customer_duty_evl_content,customer_cmnct_grade,customer_cmnct_evl_content,customer_evl_start,customer_id,employee_id,project_id) values';
    const sqlValue = `("${c.customer_evl_id}", "${c.customer_duty_grade}", "${c.customer_duty_evl_content}","${c.customer_cmnct_grade}", "${c.customer_cmnct_evl_content}","${c.customer_evl_start}","${c.customer_id}","${c.employee_id}", "${c.project_id}");`;        
    maria.query(sql+sqlValue, function(err, rows, fields) {
        if(!err) {
            res.json(true);
        } else {
            console.log(err);
            res.json(false);
        }
    });
} catch (e) {
    console.log(e);
    res.json(false);
}
});

//고객 평가 정보 수정 페이지
router.get("/update_c", function (req, res, next) {
  res.render("evaluate/evaluate_c_update");
});

//고객 평가 정보 수정 페이지 > 수정
router.post('/update_c/modify', function(req, res, next) {
  try{
    const c = req.body;
    const sql = 'update customer_evl set customer_evl_id="' + c.customer_evl_id+'",customer_duty_grade="' 
    + c.customer_duty_grade+'",customer_duty_evl_content="' + c.customer_duty_evl_content+'",customer_cmnct_grade="' 
    + c.customer_cmnct_grade+'", customer_cmnct_evl_content="' + c.customer_cmnct_evl_content+'" ,customer_evl_start="' 
    + c.customer_evl_start+'",customer_id="'+c.customer_id +'" where project_id="'+c.project_id+'" and employee_id="'+c.employee_id+'";'  
    maria.query(sql, function(err, rows, fields) {
        if(!err) {
            res.json(true);
        } else {
            console.log(err);
            res.json(false);
        }
    });
} catch (e) {
    console.log(e);
    res.json(false);
}
});

//PM 평가 정보 삽입 페이지
router.get("/submit_p", function (req, res, next) {
  res.render("evaluate/evaluate_p_insert");
});

//PM 평가 정보 삽입 페이지 > 삽입
router.post('/submit_p/insert', function(req, res, next) {
  try{
    const p = req.body;
    const sql = 'INSERT INTO pm_evl (pm_evl_id,pm_duty_grade,pm_duty_evl_content,pm_cmnct_grade,pm_cmnct_evl_content,pm_evl_start,project_manager_id,employee_id,project_id) values';
    const sqlValue = `("${p.pm_evl_id}", "${p.pm_duty_grade}", "${p.pm_duty_evl_content}","${p.pm_cmnct_grade}", "${p.pm_cmnct_evl_content}","${p.pm_evl_start}","${p.project_manager_id}","${p.employee_id}", "${p.project_id}");`;        
    maria.query(sql+sqlValue, function(err, rows, fields) {
        if(!err) {
            res.json(true);
        } else {
            console.log(err);
            res.json(false);
        }
    });
} catch (e) {
    console.log(e);
    res.json(false);
}
});

//PM 평가 정보 수정 페이지
router.get("/update_p", function (req, res, next) {
  res.render("evaluate/evaluate_p_update");
});

//PM 평가 정보 수정 페이지 > 수정
router.post('/update_p/modify', function(req, res, next) {
  try{
    const p = req.body;
    const sql = 'update pm_evl set pm_evl_id="' + p.pm_evl_id+'",pm_duty_grade="' 
    + p.pm_duty_grade+'",pm_duty_evl_content="' + p.pm_duty_evl_content+'",pm_cmnct_grade="' 
    + p.pm_cmnct_grade+'", pm_cmnct_evl_content="' + p.pm_cmnct_evl_content+'", pm_evl_start="' 
    + p.pm_evl_start+'", project_manager_id="'+ p.project_manager_id +'" where project_id="'+p.project_id+'" and employee_id="'+p.employee_id+'";'  
    
    maria.query(sql, function(err, rows, fields) {
        if(!err) {
            res.json(true);
        } else {
            console.log(err);
            res.json(false);
        }
    });
} catch (e) {
    console.log(e);
    res.json(false);
}
});





module.exports = router;