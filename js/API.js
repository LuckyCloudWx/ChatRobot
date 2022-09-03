const API = (function(){
    BASE_URL = 'https://study.duyiedu.com';
    TOKEN_KEY = 'token';
    
    async function get(path){
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if(token){
            headers.authorization = token;
        }
        return await fetch(BASE_URL + path, {
            headers
        });
    }
    
    async function post(path,body){
        const headers = {'Content-Type': 'application/json'};
        const token = localStorage.getItem(TOKEN_KEY);
        if(token){
            headers.authorization = token;
        }
        return await fetch(BASE_URL + path, {
            headers,
            method: 'POST',
            body:JSON.stringify(body)
        });
    
    }
    
    function reg(userInfo){
        return post('/api/user/reg',userInfo).then(resp=> resp.json());
    };
    
    async function login(loginInfo){
        const resp =  await post('/api/user/login',loginInfo);
        const result = await resp.json();
        if(result.code === 0){
            console.log(resp.headers.get('authorization'));
            localStorage.setItem(TOKEN_KEY, `Bearer ${resp.headers.get('authorization')}`);
        }
        return result;
    };
    
    function exists(loginId){
        return get('/api/user/exists?loginId='+loginId).then(resp=> resp.json());
    };
    
    function profile(){
        return get('/api/user/profile').then(resp => resp.json());
    };
    
    function sendChat(message){
        return post('/api/chat',message).then(resp => resp.json());
    };
    
    function getHestory(){
        return get('/api/chat/history').then(resp => resp.json());
    
    };

    function logout(){
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHestory,
        logout
    };
})()
