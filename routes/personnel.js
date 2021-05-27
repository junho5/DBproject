var express = require('express');
var router = express.Router();

const maria = require("../maria");

router.get('/', function(req, res, next) {
  res.render('personnel/personnel_information', { title: 'personnel_information' });
});

router.post('/personnel_information', function (req, res, next) {
  var employee_id = req.body['employee_id'];
    var employee_name = req.body['employee_name']; 
    var ihidnum = req.body['ihidnum']; 
    var join_day = req.body['join_day'];
    var final_graduate = req.body['final_graduate'];
    var web_manage_id = req.body['web_manage_id'];
    var pass_word = req.body['pass_word'];
    var master_check = req.body['master_check'];

    maria.query('INSERT INTO employee(employee_id, employee_name, ihidnum, final_graduate, join_day, web_manage_id, pass_word, master_check ) VALUES (?,?,?,?,?,?,?,?)', [employee_id, employee_name, ihidnum, final_graduate, join_day, web_manage_id, pass_word, master_check],function (err, result) {
      if (!err) {
          res.send('저장 완료');
    } 
    else {
        res.send('error : ' + err);
    }
  });
});

router.get('/personnel_modify', function(req, res, next) {
  res.render('personnel/personnel_modify', { title: 'personnel_modify' });
});

router.post('/personnel_modify', function (req, res, next) {
  var employee_id = req.body['employee_id'];
  var new_employee_id = req.body['new_employee_id'];
  var employee_name = req.body['employee_name'];
  var ihidnum = req.body['ihidnum'];     
  var final_graduate = req.body['final_graduate'];
  var join_day = req.body['join_day'];
  var end_day = req.body['end_day'];
  var web_manage_id = req.body['web_manage_id'];
  var pass_word = req.body['pass_word'];
  var master_check = req.body['master_check']; 

  var new_employee_id=employee_id;

  maria.query('UPDATE employee SET employee_id = ?, employee_name = ?, ihidnum = ?, final_graduate=?, join_day=?, end_day =?, web_manage_id =?, pass_word=?, master_check=? where employee_id = ? ', [employee_id, employee_name, ihidnum, final_graduate, join_day, end_day, web_manage_id, pass_word, master_check, new_employee_id], function (err, result) {
    if (!err) {
      res.send('수정 완료');
    } else {
    res.send('error : ' + err);
    }
  });
});

router.get('/personnel_search', function(req, res, next) {
  res.render('personnel/personnel_search', { title: 'personnel_search' });
});

router.post('/personnel_search', function (req,res,next) {
  if (req.body.searchhr=="사번"){
    var employee_id = req.body.search
    var sql_d = "SELECT employee_name, employee_id,ihidnum, In_office, DATE_FORMAT(join_day,'%Y-%m-%d') join_day, DATE_FORMAT(end_day,'%Y-%m-%d') end_day, final_graduate from employee where employee_id ='" + employee_id+"' ;" ;
    var sql_e ="SELECT ep.project_id, p.project_name, dr.developer_role_name, DATE_FORMAT(project_participate_date,'%Y-%m-%d') project_participate_date, DATE_FORMAT(project_participate_end_date,'%Y-%m-%d') project_participate_end_date from employee_project ep, developer_role dr,project p WHERE ep.developer_role_id = dr.developer_role_id && p.project_id= ep.project_id && ep.employee_id ='" + employee_id+"' ;";
    var sql_f = "SELECT e.employee_name ,c.career_id,DATE_FORMAT(career_start_date,'%Y-%m-%d') career_start_date, DATE_FORMAT(career_end_date,'%Y-%m-%d') career_end_date, c.career_name, c.career_content FROM employee e, career c WHERE e.employee_id = c.employee_id AND e.employee_id ='" + employee_id+"' ;"
    var sql_g = 'SELECT e.employee_name, s.skill_id, s.skill_name,s.skill_rank,s.skill_content FROM employee e, skill s WHERE e.employee_id = s.employee_id AND e.employee_id ="' + employee_id+'" ;';
    maria.query(sql_d+sql_e+sql_f+sql_g,function(err, rows,fields) { // 쿼리문을 이용해 데이터를 가져온다.
      var sql_d_result = rows[0]
      var sql_e_result = rows[1]
      var sql_f_result = rows[2]
      var sql_g_result = rows[3]
      if (!err) {
        if (sql_d_result!=undefined) {
          
          res.render('personnel/personnel_search',{
            personnels :[sql_d_result,sql_e_result,sql_f_result,sql_g_result]});
        } else {
            res.send('no data');
        }
      
      } else {
        res.send('error : ' + err);
      }
    });
  }
  else if(req.body.searchhr=="직원이름"){
    var employee_name = req.body.search
    var sql_h = "select employee_name, employee_id, ihidnum, In_office, DATE_FORMAT(join_day,'%Y-%m-%d') join_day, DATE_FORMAT(end_day,'%Y-%m-%d') end_day, final_graduate from employee where employee_name = '"+ employee_name+"' ;";
    var sql_i ="select ep.project_id, p.project_name, dr.developer_role_name, DATE_FORMAT(project_participate_date,'%Y-%m-%d') project_participate_date, DATE_FORMAT(project_participate_end_date,'%Y-%m-%d') project_participate_end_date from employee_project ep, developer_role dr,project p, employee e WHERE ep.developer_role_id = dr.developer_role_id && p.project_id= ep.project_id && ep.employee_id = e.employee_id && e.employee_name ='" + employee_name+"' ;";
    var sql_j = "SELECT e.employee_name ,c.career_id, c.career_id,DATE_FORMAT(career_start_date,'%Y-%m-%d') career_start_date, DATE_FORMAT(career_end_date,'%Y-%m-%d') career_end_date, c.career_name, c.career_content FROM employee e, career c WHERE e.employee_id = c.employee_id AND e.employee_name ='" + employee_name+"' ;";
    var sql_k = "SELECT e.employee_name, s.skill_id, s.skill_name,s.skill_rank,s.skill_content FROM employee e, skill s WHERE e.employee_id = s.employee_id AND e.employee_name ='" + employee_name+"' ;";
    maria.query(sql_h+sql_i+sql_j+sql_k,function(err, rows,fields) { // 쿼리문을 이용해 데이터를 가져온다.
      var sql_h_result = rows[0]
      var sql_i_result = rows[1]
      var sql_j_result = rows[2]
      var sql_k_result = rows[3]
      if (!err) {
        if (sql_h_result!=undefined) {
          
          res.render('personnel/personnel_search',{
            personnels :[sql_h_result,sql_i_result,sql_j_result,sql_k_result]});
        } else {
            res.send('no data');
        }
      
      } else {
        res.send('error : ' + err);
      }
    });
  }

    });

// 요구사항 9번항목
router.get('/department_info', function(req, res, next) {
  res.render('personnel/department_info');
});  

router.post('/department_info', function (req, res, next) {
  var department_id = req.body['department_id'];
  var sql ='SELECT e.employee_id,e.employee_name,d.department_name,p.position_id,p.position_name FROM employee e , department d , position p WHERE e.department_id=d.department_id AND e.position_id=p.position_id AND d.department_id=? ORDER BY position_id desc'
  maria.query(sql,[department_id], function (err, result) {
    if (!err) {
      if (result[0]!=undefined)
          res.render('personnel/department_info', { results:result});
      else {
          res.send('no data');
      }

    } else {
        res.send('error : ' + err);
    }
  });
});

// 부서 변경
router.get('/department_update', function(req, res, next) {
  res.render('personnel/department_update', { title: 'department_update' });
});

router.post('/department_update', function (req, res, next) {
  var employee_id = req.body['employee_id'];
  var department_id = req.body['department_id'];
  var new_employee_id = req.body['new_employee_id'];
  var new_department_id = req.body['new_department_id'];
  maria.query('update employee set employee_id=?,department_id=? where employee_id=? and department_id=?',[new_employee_id,new_department_id,employee_id,department_id], function (err, rows) {
    if (!err) {
            res.send('success');
    } else {
        res.send('error : ' + err);
    }
  });
});

// 직급 변경
router.get('/position_update', function(req, res, next) {
  res.render('personnel/position_update', { title: 'position_update' });
});

router.post('/position_update', function (req, res, next) {
  var employee_id = req.body['employee_id'];
  var position_id = req.body['position_id'];
  var new_employee_id = req.body['new_employee_id'];
  var new_position_id = req.body['new_position_id'];
  maria.query('update employee set employee_id=?,position_id=? where employee_id=? and position_id=?',[new_employee_id,new_position_id,employee_id,position_id], function (err, rows) {
    if (!err) {
            res.send('success');
    } else {
        res.send('error : ' + err);
    }
  });
});

module.exports = router;