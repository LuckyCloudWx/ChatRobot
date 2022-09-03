// 用户注册

// 账号验证
const inputIdValidator = new FieldValidator('txtLoginId',async function(val){
    if(!val) return '请输入您的账号';
    const resp = await API.exists(val);
    console.log(resp);
    if(resp.data){
        return '该账号已被注册'
    }
    return null;
});

// 昵称验证
const inputNameValidator = new FieldValidator('txtNickname',async function(val){
    if(!val) return '请输入您的昵称';
    return null;
});

// 密码验证
const inputPwdValidator = new FieldValidator('txtLoginPwd',async function(val){
    if(!val) return '请输入您的密码';
    return null;
});

// 确认密码验证
const inputPwdConfValidator = new FieldValidator('txtLoginPwdConfirm',async function(val){
    if(!val) return '请输入您的密码确认';
    if(val !== inputPwdValidator.input.value) return '前后密码不一致';
    return null;
});

// 全部验证:当表单提交时，对表单内所有的输入框进行验证,验证通过，则进行注册，并跳转页面
const form = $('.user-form');
form.onsubmit = async function(e) {
    e.preventDefault();
    const result = await FieldValidator.validate(inputIdValidator,inputNameValidator,inputPwdValidator,inputPwdConfValidator);
    if(result){
        const formdata = new FormData(form);
        const result = Object.fromEntries(formdata.entries());
        const regInfo = await API.reg(result);
        console.log(regInfo);
        if(regInfo.code === 0){
            alert('注册成功！点击‘确定’返回登录页');
            window.location = 'login.html';
        }
    }
};