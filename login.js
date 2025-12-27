(function() {
  // 存储KEY
  const STORAGE_KEYS = {
    ADMIN_LOGIN: 'isAdminLogin',
    ADMIN_PWD: 'adminPwd'
  };

  // 隐私配置（隐藏）
  const ADMIN_CONFIG = {
    user: 'xiaoyi',
    defaultPwd: 'qtxiaoyi',
    fixedCode: '942694'
  };

  window.onload = function() {
    bindLoginEvent();
    // 未登录禁止访问后台
    if(localStorage.getItem(STORAGE_KEYS.ADMIN_LOGIN) !== "true" && window.location.href.includes("3.admin.html")) {
      window.location.href = "2.login.html";
    }
  };

  // 登录按钮点击
  function bindLoginEvent() {
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.onclick = function() {
      const adminUser = document.getElementById("adminUser").value.trim();
      const adminPwd = document.getElementById("adminPwd").value.trim();
      const verifyCode = document.getElementById("verifyCode").value.trim();

      // 非空校验
      if(!adminUser || !adminPwd || !verifyCode) {
        alert("账号、密码、验证码不能为空！");
        return;
      }

      // 账号校验
      if(adminUser !== ADMIN_CONFIG.user) {
        alert("账号错误，请重新输入！");
        return;
      }

      // 验证码校验
      if(verifyCode !== ADMIN_CONFIG.fixedCode) {
        alert("验证码错误，请重新输入！");
        return;
      }

      // 密码校验（优先本地修改后的密码）
      const currentPwd = localStorage.getItem(STORAGE_KEYS.ADMIN_PWD) || ADMIN_CONFIG.defaultPwd;
      if(adminPwd !== currentPwd) {
        alert("密码错误，请重新输入！");
        return;
      }

      // 登录成功
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGIN, "true");
      alert("登录成功！即将进入管控后台");
      window.location.href = "3.admin.html";
    };
  }
})();