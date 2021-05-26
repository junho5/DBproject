const main = {
    init: function () {
    const _this = this;
    document.getElementById("button_insert").onclick = function () {
        _this.write2();
    }
    },
    write2: function () {
    var today = new Date();
    const c = {
        employee_id: document.getElementById("employee_id").value,
        project_id: document.getElementById("project_id").value,
        customer_evl_id: document.getElementById("customer_evl_id").value,
        customer_duty_grade: document.getElementById("customer_duty_grade").value,
        customer_duty_evl_content: document.getElementById("customer_duty_evl_content").value,
        customer_cmnct_grade: document.getElementById("customer_cmnct_grade").value,
        customer_cmnct_evl_content: document.getElementById("customer_cmnct_evl_content").value,
        customer_evl_start: document.getElementById("customer_evl_start").value,
        customer_id : document.getElementById("customer_id").value,
    };
    console.log(c)
    axios.post("/evaluate/submit_c/insert", c).then(function (result) {
      if (result.data) {
        // 해당 주소에 접속한 결과값이 true이면 /board로 이동
        location.href = "/evaluate/submit_c";
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