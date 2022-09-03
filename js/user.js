// 通用方法：创建一个验证“类”，实现各个输入框的验证操作
class FieldValidator{
    constructor(txtId,validatorFunc){
        this.input = $('#'+txtId);
        this.p = this.input.nextElementSibling;
        // 当输入框失去焦点，出发验证事件
        this.input.onblur = ()=>{
            this.validate();
        };
        this.validatorFunc = validatorFunc;
    };

    // 验证方法：验证成功，返回true，失败返回false
    async validate(){
        const val = this.input.value;
        const err = await this.validatorFunc(val);
        if(err){
            this.p.innerText = err;
            return false;
        }
        else{
            this.p.innerText = '';
            return true;
        }
    }

    // 静态验证方法，传入的验证实例全部成功则为成功，返回true，否则返回false
    static async validate(...validators){
        // 将验证数组项简化为仅仅包含true、false的数组，每一项对应原验证实例的返回值
        const valiArr = validators.map(v=>v.validate());
        const prom = await Promise.all(valiArr);
        console.log(prom);
        return prom.every(v=>v);
    }
};

