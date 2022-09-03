(async function (){
    // 验证用户是否登录
    const resp =  await API.profile();
    const user = resp.data;
    console.log(user);
    if(!user){
        alert('您未登录或登录已过期，请重新登录');
        window.location = 'login.html';
        return;
    }

    // 用户登录成功，则执行以下代码

    /**
     * 将可能用到的dom元素放置在doms对象中
     */

    const doms = {
        aside:{
            nickname:$('#nickname'),
            loginId:$('#loginId'),
            close:$('.close'),
        },
        main:{
            container:$('.chat-container'),
            input:$('.msg-container')
        }
    }

    // 获取用户信息，显示在姓名栏
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
    
    // 加载历史记录
    loadHestory();

    async function loadHestory(){
        const resp = await API.getHestory();
        for (const item of resp.data) {
            sendChat(item);
        }

        autoScroll();
    }

    // 发送消息
    // 滚轮自动拖动到最下方
    function autoScroll(){
        doms.main.container.scrollTop = doms.main.container.scrollHeight;
    }
    
    async function sendChat(message){
        const item = $$$('div');
        item.classList.add('chat-item');
        if(message.from){
            item.classList.add('me');
        }
        
        const img = $$$('img');
        img.classList.add('chat-avatar');
        img.src = message.from?'./asset/avatar.png':'./asset/robot-avatar.jpg';

        const content = $$$('div');
        content.classList.add('chat-content');
        content.innerText = message.content;

        const date = $$$('div');
        date.classList.add('chat-date');
        date.innerText = _formatDate(message.createdAt);

        function _formatDate(timestamp){
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();

            const result = `${year}-${month}-${day} ${hour}:${minute}:${second}`
            return result;
        }

        item.appendChild(img);
        item.appendChild(content);
        item.appendChild(date);
        $('.chat-container').appendChild(item);
    }

    async function autoSend(){
        // 读取输入框消息并输出显示在聊天框，提交后输入框清空
        const content = $('#txtMsg').value;
        if(!content) return;

        const message = {
            from:user.loginId,
            to:null,
            content,
            createdAt:Date.now(),
        };

        sendChat(message);
        $('#txtMsg').value = '';

        autoScroll();

        // 接受机器人的回复并输出显示在聊天框
        const resp = await API.sendChat({content});
        const data = resp.data;
        sendChat({
            from:null,
            to:user.loginId,
            ...data
        });
        autoScroll();

    }

    // 为表单提交注册事件
    doms.main.input.onsubmit = function(e){
        e.preventDefault();
        autoSend();
    };

    // 为关闭按钮注册事件
    doms.aside.close.onclick = function(){
        API.logout();
        window.location = 'login.html';
    };

})();

