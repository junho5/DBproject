var express = require('express');
var router = express.Router();
const maria = require("../maria");

/* GET project submit page. */
//프로젝트 등록 화면으로 이동
router.get('/', function(req, res, next) {
    res.render('project/project_submit', { title: 'project_submit' });
  });

//프로젝트 정보 등록(insert data)
router.post('/submit', function(req, res, next) {
  try{
    const project = req.body;
    const sql = 'INSERT INTO project (project_id, project_name, project_start_date, project_terminate_date,project_type,customer_id) values ';
    const sqlValue = `("${project.project_id}", "${project.project_name}", "${project.project_start_date}", "${project.project_terminate_date}","${project.project_type}","${project.customer_name}");`;
    maria.query(sql + sqlValue, function(err, rows, fields) {
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
}});

//프로젝트 정보 수정
router.get('/modify', function(req, res, next) {
  res.render('project/project_modify', { title: 'project_modify' });
});

//프로젝트 정보 수정 > 프로젝트 번호로 조회
router.get('/modify/search',function(req,res,next) {
  var project_id = req.query.project_id;
  var sql = 'select * from project where project_id ="' + project_id+'" ;';
  var sql1 = 'select * from employee_project where project_id ="' + project_id+'" ;';
  maria.query(sql+sql1, function(err, rows, fields) { // 쿼리문을 이용해 데이터를 가져온다.
    var sql_c_result = rows[0]
    var sql_c_result1 = rows[1]
    if(!err) { // 에러가 없다면
      // res.send(rows);
      res.render("project/project_modify", {
        projects : [sql_c_result,sql_c_result1],});
    } else { // 에러가 있다면?
      console.log("err : " + err);
      res.send(err); // console 창에 에러를 띄워주고, 에러를 보내준다.
    }
  });
});

//프로젝트 정보 수정 
router.get('/modify/search/employee', function(req,res,next) {
  var employee_name = req.query.emp_name;
  var project_id = req.query.project_id;
  console.log(employee_name);
  var sql = 'select * from employee where employee_name ="' + employee_name+'" ;';
  maria.query(sql, function(err, rows, fields) { // 쿼리문을 이용해 데이터를 가져온다.
    if(!err) { // 에러가 없다면
      // res.send(rows);
      res.render("project/project_modify", {
        employees : [rows,project_id],});
    } else { // 에러가 있다면?
      console.log("err : " + err);
      res.send(err); // console 창에 에러를 띄워주고, 에러를 보내준다.
    }
  });
});

//프로젝트 정보 수정
router.post('/modify', function(req, res, next) {
  try{
    const project = req.body;
    const sql = 'update project set project_name="' + project.project_name+'",project_start_date="' + project.project_start_date+'",project_terminate_date="' + project.project_terminate_date+'",customer_id="' + project.customer_name+'", project_type="' + project.project_type+'" where project_id="'+project.project_id+'";'
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

//프로젝트 정보 수정 > 팀원 추가 위한 검색
router.post('/modify/search', function(req, res, next) {
  try{
    const project = req.body;
    const sql = 'INSERT INTO employee_project (employee_id,project_id,project_participate_date,project_participate_end_date,developer_role_id) values ';
    const sqlValue = `("${project.employee_id}", "${project.project_id}", "${project.project_participate_date}", NULL,"${project.developer_role_id}");`;    
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

router.get('/view', function(req, res, next) {
  res.render('project/project_view', { title: 'project_view' });
});

router.post('/view', function (req,res,next) {
  if (req.body.searchhr=="프로젝트 번호"){
    var project_id = req.body.search
    var sql = "select p.project_id,p.project_name,p.project_start_date,p.project_terminate_date,c.customer_name from project p , customer c where p.customer_id=c.customer_id && p.project_id ='" + project_id+"' ;" ;
    var sql_c = "select customer_evl_id, customer_duty_grade, customer_cmnct_grade, customer_duty_evl_content, customer_cmnct_evl_content from customer_evl where project_id ='" + project_id+"' ;" ;
    var sql_p = "select pm_evl_id, pm_duty_grade, pm_cmnct_grade, pm_duty_evl_content, pm_cmnct_evl_content from pm_evl where project_id ='" + project_id+"' ;" ;
    var sql_e = "select employee_evl_id, employee_duty_grade, employee_cmnct_grade, employee_duty_evl_content, employee_cmnct_evl_content from employee_evl where project_id='" + project_id+"' ;" ;
    maria.query(sql+sql_c+sql_p+sql_e,function(err, rows,fields) { 
      var sql_result = rows[0]
      var sql_c_result = rows[1]
      var sql_p_result = rows[2]
      var sql_e_result = rows[3]
      if (!err) {
        if (sql_result!=undefined) {
          res.render('project/project_view',{
            views :[sql_result,sql_c_result,sql_p_result,sql_e_result]});
        } else {
            res.send('no data');
        }
      
      } else {
        res.send('error : ' + err);
      }
    });
  }
});

module.exports = router;
