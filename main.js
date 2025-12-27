(function() {
  // 统一存储KEY
  const STORAGE_KEYS = {
    MASTER_DATA: 'masterData',
    MASTER_LIKE: 'masterLike',
    MASTER_COMMENTS: 'masterComments'
  };

  // 初始化数据
  let masterData = JSON.parse(localStorage.getItem(STORAGE_KEYS.MASTER_DATA)) || {
    title: "欢迎访问主控人公告平台",
    content: "主控人未发布公告，敬请期待！",
    time: new Date().toLocaleString(),
    like: localStorage.getItem(STORAGE_KEYS.MASTER_LIKE) || 0,
    comments: JSON.parse(localStorage.getItem(STORAGE_KEYS.MASTER_COMMENTS)) || []
  };

  // 页面加载完成执行
  window.onload = function() {
    flashMasterContent();
    renderMasterContent();
    bindLikeEvent();
    bindCommentEvent();
    bindMyBtnEvent();
  };

  // 闪现特效
  function flashMasterContent() {
    const flashBox = document.getElementById("flashBox");
    const flashText = document.createElement("div");
    flashText.className = "flash-text";
    flashText.innerText = masterData.title;
    flashBox.appendChild(flashText);
    setTimeout(() => flashText.remove(), 2200);
  }

  // 渲染内容
  function renderMasterContent() {
    const masterContent = document.getElementById("masterContent");
    masterContent.innerHTML = `
      <h3>${masterData.title}</h3>
      <p>${masterData.content}</p>
      <div class="time">发布时间：${masterData.time}</div>
    `;
    document.getElementById("likeNum").innerText = masterData.like;
    renderComments();
  }

  // 点赞按钮点击
  function bindLikeEvent() {
    const likeBtn = document.getElementById("likeBtn");
    likeBtn.onclick = function() {
      masterData.like++;
      document.getElementById("likeNum").innerText = masterData.like;
      localStorage.setItem(STORAGE_KEYS.MASTER_LIKE, masterData.like);
      localStorage.setItem(STORAGE_KEYS.MASTER_DATA, JSON.stringify(masterData));
      // 点击反馈
      alert("点赞成功！");
    };
  }

  // 评论按钮点击
  function bindCommentEvent() {
    const sendComment = document.getElementById("sendComment");
    const commentInput = document.getElementById("commentInput");

    sendComment.onclick = function() {
      let commentText = commentInput.value.trim();
      if(!commentText) {
        alert("请输入评论内容！");
        return;
      }
      if(commentText.length > 200) {
        alert("评论最多200字！");
        return;
      }

      // 敏感词过滤
      const sensitiveWords = ['违规','违法','垃圾'];
      sensitiveWords.forEach(word => {
        commentText = commentText.replace(new RegExp(word, 'g'), '***');
      });

      // 添加评论
      masterData.comments.push({
        text: commentText,
        time: new Date().toLocaleTimeString()
      });

      commentInput.value = "";
      renderComments();
      // 存储评论
      localStorage.setItem(STORAGE_KEYS.MASTER_COMMENTS, JSON.stringify(masterData.comments));
      localStorage.setItem(STORAGE_KEYS.MASTER_DATA, JSON.stringify(masterData));
      alert("评论发布成功！");
    };
  }

  // 渲染评论
  function renderComments() {
    const commentList = document.getElementById("commentList");
    commentList.innerHTML = "";

    if(masterData.comments.length === 0) {
      commentList.innerHTML = '<div class="comment-item">暂无评论，快来发第一条吧！</div>';
      return;
    }

    masterData.comments.forEach(comment => {
      const item = document.createElement("div");
      item.className = "comment-item";
      item.innerHTML = `
        <div>${comment.text}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;">${comment.time}</div>
      `;
      commentList.appendChild(item);
    });
  }

  // 我的按钮+弹窗点击
  function bindMyBtnEvent() {
    const myBtn = document.getElementById("myBtn");
    const myModal = document.getElementById("myModal");
    const closeModal = document.getElementById("closeModal");

    // 打开弹窗
    myBtn.onclick = function() {
      myModal.style.display = "flex";
    };

    // 关闭弹窗
    closeModal.onclick = function() {
      myModal.style.display = "none";
    };

    // 点击弹窗外关闭
    window.onclick = function(event) {
      if (event.target === myModal) {
        myModal.style.display = "none";
      }
    };
  }
})();