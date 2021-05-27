const express = require('express');
const router = express.Router();

const maria = require("../maria");

router.get('/', function(req, res, next) {
  const start = req.query.start;
  const end = req.query.end;
  
  
  if (start && end) {
  var sql ='SELECT project_id, project_name, DATE_FORMAT(project_start_date,\'%Y-%m-%d\') project_start_date, DATE_FORMAT(project_terminate_date,\'%Y-%m-%d\') project_terminate_date, ' +
            'project_type, customer_id FROM project WHERE project_start_date >= \"'+start+'\" AND project_terminate_date <= \"'+end+'\"  ORDER BY project_terminate_date';
  
  console.log(start);
  console.log(end);
  }
  else {
    var sql ='SELECT project_id, project_name, DATE_FORMAT(project_start_date,\'%Y-%m-%d\') project_start_date, DATE_FORMAT(project_terminate_date,\'%Y-%m-%d\') project_terminate_date, ' +
            'project_type, customer_id FROM project ORDER BY project_terminate_date';
  }

  maria.query(sql, function (err, rows) {
      if (err) console.error("err : " + err);
      
      console.log("rows : " + JSON.stringify(rows));
    
      res.render('projects/index', {rows: rows?rows:{}});
    });
})

router.get('/:id', function (req, res, next) {
  var sql1 = 'SELECT project_id, project_name, DATE_FORMAT(project_start_date,\'%Y-%m-%d\') project_start_date, DATE_FORMAT(project_terminate_date,\'%Y-%m-%d\') project_terminate_date, ' + 
            'customer_id FROM project WHERE project_id=?;';
            
  var sql2 = 'SELECT distinct project_manager_id FROM project, project_manager ' + 
            'WHERE project.project_id=\"'+req.params.id+'\" AND project.project_id = project_manager.project_id;';

  var sql3 = 'SELECT e.in_office, e.employee_name, e.employee_id, d.department_name, r.role_id, r.role_name, DATE_FORMAT(ep.project_participate_date, \'%Y-%m-%d\') start, DATE_FORMAT(ep.project_participate_end_date, \'%Y-%m-%d\') end FROM employee e, department d, role r, employee_project ep, project p ' + 
            'WHERE ep.project_id=\"'+req.params.id+'\" AND e.role_id=r.role_id AND e.department_id=d.department_id AND e.employee_id=ep.employee_id AND p.project_terminate_date = ep.project_participate_end_date;';
            
  var sql4 = 'SELECT e.in_office, e.employee_name, e.employee_id, d.department_name, r.role_id, r.role_name, DATE_FORMAT(ep.project_participate_date, \'%Y-%m-%d\') start, DATE_FORMAT(ep.project_participate_end_date, \'%Y-%m-%d\') end FROM employee e, department d, role r, employee_project ep ' + 
            'WHERE ep.project_id=\"'+req.params.id+'\" AND e.role_id=r.role_id AND e.department_id=d.department_id AND e.employee_id=ep.employee_id;';
  
  maria.query(sql1+sql2+sql3+sql4, req.params.id, function (err, rows, fields) {
    var sql1_result = rows[0]
    var sql2_result = rows[1]
    var sql3_result = rows[2]
    var sql4_result = rows[3]
    
    console.log("rows : " + JSON.stringify(rows[0]));
    console.log("rows : " + JSON.stringify(rows[1]));
    console.log("rows : " + JSON.stringify(rows[2]));
    console.log("rows : " + JSON.stringify(rows[3]));

    if (err) console.error("err : " + err);
      

    res.render('projects/show', {
      rows : [sql1_result, sql2_result, sql3_result,sql4_result],});
  });
});



module.exports = router;