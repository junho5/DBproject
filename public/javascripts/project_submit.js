function getFormatDate(date){
  var year = date.getFullYear();
  var month = (1 + date.getMonth());
  month = month >= 10 ? month : '0' + month;
  var day = date.getDate();
  day = day >= 10 ? day : '0' + day;
  return year + '-' + month + '-' + day;
}
const main = {
    init: function () {
      const _this = this;
      document.getElementById("submit").onclick = function () {
        _this.write();
      };
      document.getElementById("add").onclick = function () {
        _this.write2();
      }
    },
    write: function () {
      const project = {
        project_id: document.getElementById("project_id").value,
        project_name: document.getElementById("project_name").value,
        project_start_date: document.getElementById("project_start_date").value,
        project_terminate_date: document.getElementById("project_terminate_date").value,
        project_type : document.getElementById("project_type").value,
        customer_name: document.getElementById("customer_name").value,
      };
      console.log(project)
      axios.post("/project/submit", project).then(function (result) {
        if (result.data) {
          // 해당 주소에 접속한 결과값이 true이면 /board로 å이동
          alert('저장했습니다.')
          location.href = "/project";
          console.log('success');
        } else {
          // 만약 false라면 오류입니다 라는 문구를 띄워줌.
          alert("오류입니다.");
        }
      });
    },
    write2: function () {
      var today = new Date();
      const employee = {
        employee_id : document.getElementById("employee_id2").innerText,
        project_id: document.getElementById("project_id").value,
        project_participate_date: getFormatDate(today),
        project_terminate_date: null,
        developer_role_id: document.getElementById("developer_role_id").value,
      };
      console.log(employee)
      axios.post("/project/search", employee).then(function (result) {
        if (result.data) {
          // 해당 주소에 접속한 결과값이 true이면 /board로 이동
          location.href = "/project/search";
          alert('저장했습니다.')
          console.log('success');
        } else {
          // 만약 false라면 오류입니다 라는 문구를 띄워줌.
          alert("오류입니다.");
        }
      });
    },
  };
  
  main.init();