const main = {
    init: function () {
    const _this = this;
    document.getElementById("button_insert").onclick = function () {
        _this.write2();
    }
    },
    write2: function () {
      const c = {
          employee_id: document.getElementById("employee_id").value,
          project_id: document.getElementById("project_id").value,
          pm_evl_id: document.getElementById("pm_evl_id").value,
          pm_duty_grade: document.getElementById("pm_duty_grade").value,
          pm_duty_evl_content: document.getElementById("pm_duty_evl_content").value,
          pm_cmnct_grade: document.getElementById("pm_cmnct_grade").value,
          pm_cmnct_evl_content: document.getElementById("pm_cmnct_evl_content").value,
          pm_evl_start: document.getElementById("pm_evl_start").value,
          project_manager_id : document.getElementById("project_manager_id").value,
      };
      console.log(c)
      axios.post("/evaluate/submit_p/insert", c).then(function (result) {
        if (result.data) {
          // 해당 주소에 접속한 결과값이 true이면 /board로 이동
          alert('저장했습니다.')
          location.href = "/evaluate/submit_p";
          console.log('success');
        } else {
          // 만약 false라면 오류입니다 라는 문구를 띄워줌.
          alert("오류입니다.");
        }
      });
    },
};

main.init();