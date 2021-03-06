const main = {
    init: function () {
    const _this = this;
    document.getElementById("button_insert").onclick = function () {
        _this.write2();
    }
    },
    write2: function () {
    var today = new Date();
    const emp = {
      employee_id: document.getElementById("employee_id").value,
      project_id: document.getElementById("project_id").value,
      employee_evl_id: document.getElementById("employee_evl_id").value,
      employee_duty_grade: document.getElementById("employee_duty_grade").value,
      employee_duty_evl_content: document.getElementById("employee_duty_evl_content").value,
      employee_cmnct_grade: document.getElementById("employee_cmnct_grade").value,
      employee_cmnct_evl_content: document.getElementById("employee_cmnct_evl_content").value,
      employee_evl_start: document.getElementById("employee_evl_start").value,
      employee_p_evl_id: document.getElementById("employee_p_evl_id").value,
      employee_p_id: document.getElementById("employee_p_id").value,
    };
    console.log(emp)
    axios.post("/evaluate/submit_e/insert", emp).then(function (result) {
      if (result.data) {
        // 해당 주소에 접속한 결과값이 true이면 /board로 이동
        location.href = "/evaluate/submit_e";
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