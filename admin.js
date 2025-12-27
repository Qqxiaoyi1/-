(function() {
  // 存储KEY
  const STORAGE_KEYS = {
    ADMIN_LOGIN: 'isAdminLogin',
    ADMIN_PWD: 'adminPwd',
    MASTER_DATA: 'masterData',
    FIREWALL_CONFIG: 'firewallConfig'
  };

  // 默认密码
  const ADMIN_DEFAULT = {
    pwd: 'qtxiaoyi'
  };

  window.onload = function() {
    // 权限校验
    if(localStorage.getItem(STORAGE_KEYS.ADMIN_LOGIN) !== "true") {
      alert("无权限访问！请先登录");
      window.location.href = "2.login.html";
      return;
    }

    // 绑定所有交互
    bindTabEvent();
    bindPublishEvent();
    bindLogoutEvent();
    bindFirewallEvent();
    bindChangePwdEvent();
    initServerStatus();
  };

  // 选项卡切换点击
  function bindTabEvent() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabBtns.forEach(btn => {
      btn.onclick = function() {
        // 移除所有激活状态
        tabBtns.forEach(b => b.classList.remove("active"));
        tabPanels.forEach(p => p.classList.remove("active"));
        // 激活当前选项卡
        this.classList.add("active");
        const tabId = this.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
      };
    });
  }

  // 发布内容按钮点击
  function bindPublishEvent() {
    const publishBtn = document.getElementById("publishBtn");
    const publishContent = document.getElementById("publishContent");

    publishBtn.onclick = function() {
      let content = publishContent.value.trim();
      if(!content) {
        alert("请输入公告内容！");
        return;
      }
      if(content.length > 500) {
        alert("公告内容最多500字！");
        return;
      }

      // 敏感词过滤
      const sensitiveWords = ['违规','违法','垃圾'];
      sensitiveWords.forEach(word => {
        content = content.replace(new RegExp(word, 'g'), '***');
      });

      // 读取旧数据，合并点赞和评论
      const oldData = JSON.parse(localStorage.getItem(STORAGE_KEYS.MASTER_DATA)) || {like:0, comments:[]};
      const masterData = {
        title: "主控人专属公告",
        content: content,
        time: new Date().toLocaleString(),
        like: oldData.like || 0,
        comments: oldData.comments || []
      };

      // 存储新公告
      localStorage.setItem(STORAGE_KEYS.MASTER_DATA, JSON.stringify(masterData));
      alert("发布成功！首页将闪现公告，旧点赞评论已保留");
      publishContent.value = "";
    };
  }

  // 退出登录按钮点击
  function bindLogoutEvent() {
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.onclick = function() {
      if(confirm("确定退出主控登录吗？")) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGIN);
        alert("退出成功！");
        window.location.href = "1.index.html";
      }
    };
  }

  // 防火墙保存按钮点击
  function bindFirewallEvent() {
    const firewallSave = document.getElementById("firewallSave");
    const firewallItems = document.querySelectorAll(".firewall-item input");

    // 加载已保存的配置
    if(localStorage.getItem(STORAGE_KEYS.FIREWALL_CONFIG)) {
      const config = JSON.parse(localStorage.getItem(STORAGE_KEYS.FIREWALL_CONFIG));
      firewallItems.forEach(item => {
        item.checked = config[item.id];
      });
    }

    // 保存配置
    firewallSave.onclick = function() {
      const firewallConfig = {};
      firewallItems.forEach(item => {
        firewallConfig[item.id] = item.checked;
      });
      localStorage.setItem(STORAGE_KEYS.FIREWALL_CONFIG, JSON.stringify(firewallConfig));
      alert("防火墙配置保存成功！全站防护已生效");
    };
  }

  // 修改密码按钮点击
  function bindChangePwdEvent() {
    const changePwdBtn = document.getElementById("changePwdBtn");
    const oldPwd = document.getElementById("oldPwd");
    const newPwd = document.getElementById("newPwd");
    const confirmPwd = document.getElementById("confirmPwd");

    changePwdBtn.onclick = function() {
      const oldVal = oldPwd.value.trim();
      const newVal = newPwd.value.trim();
      const confirmVal = confirmPwd.value.trim();
      const currentPwd = localStorage.getItem(STORAGE_KEYS.ADMIN_PWD) || ADMIN_DEFAULT.pwd;

      // 校验逻辑
      if(oldVal !== currentPwd) {
        alert("原密码错误，请重新输入！");
        return;
      }
      if(!newVal) {
        alert("新密码不能为空！");
        return;
      }
      if(newVal.length < 6 || !/[a-zA-Z]/.test(newVal) || !/[0-9]/.test(newVal)) {
        alert("新密码需至少6位，含字母+数字！");
        return;
      }
      if(newVal !== confirmVal) {
        alert("两次输入新密码不一致！");
        return;
      }
      if(newVal === oldVal) {
        alert("新密码不能与原密码一致！");
        return;
      }

      // 保存新密码
      localStorage.setItem(STORAGE_KEYS.ADMIN_PWD, newVal);
      alert("密码修改成功！下次登录使用新密码");
      // 清空输入框
      oldPwd.value = "";
      newPwd.value = "";
      confirmPwd.value = "";
    };
  }

  // 初始化服务器状态
  function initServerStatus() {
    const serverStatus = document.getElementById("serverStatus");
    const onlineNum = document.getElementById("onlineNum");
    const runTime = document.getElementById("runTime");

    serverStatus.innerText = "✅ 正常运行";
    onlineNum.innerText = Math.floor(Math.random() * 20);

    // 运行时长计时
    let seconds = 0;
    setInterval(() => {
      seconds++;
      const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      runTime.innerText = `${h}:${m}:${s}`;
    }, 1000);
  }
})();