// 用户注册

// 账号验证
const inputIdValidator = new FieldValidator('txtLoginId',function(val){
    if(!val) return '请输入您的账号';
    return null;
});

// 密码验证
const inputPwdValidator = new FieldValidator('txtLoginPwd',function(val){
    if(!val) return '请输入您的密码';
    return null;
});

// 全部验证:当表单提交时，对表单内所有的输入框进行验证
const form = $('.user-form');
form.onsubmit = async function(e) {
    e.preventDefault();
    const result = await FieldValidator.validate(inputIdValidator,inputPwdValidator);
    if(result){
        const formdata = new FormData(form);
        const result = Object.fromEntries(formdata.entries());
        const regInfo = await API.login(result);
        console.log(regInfo);
        if(regInfo.code === 0){
            alert('登录成功！点击‘确定’前往首页');
            window.location = 'index.html';
        }else{
            inputIdValidator.p.innerText = regInfo.msg;
        }
    }
};