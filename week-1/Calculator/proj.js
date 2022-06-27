function func(s,index){
    let st=new Array();
    const ok={'+':1,'-':-1};
    let char='+';
    while(index<s.length){
        //number with/out percentage
        //multipliers
        //brackets
        if(s[index]==='(') {
            let arr= func(s,index+1);
            let val=arr[0];index=arr[1];
            if(char==='/') st[st.length-1]/=val;
            else if(char==='x') st[st.length-1]*=val;
            else st.push(ok[char]*val);
        }
        else if(check[s[index]]==='mul' && s[index]!=='%') char=s[index++];
        else if(index===s.length || s[index]===')') return [st.reduce((a,b)=> a+b,0),(index===s.length)?index:index+1];
        else{
            let value="";
            while(index<s.length && (check[s[index]]==='num' || s[index]==='%' || s[index]==='.')) value=value+s[index++];
            if(value[value.length-1]==='%'){
                value=value.substr(0,value.length-1);
                value=Number(value)/100;
            }else value=Number(value);
            if(char==='/') st[st.length-1]/=value;
            else if(char==='x') {console.log(st[st.length-1],value);st[st.length-1]*=value;}
            else st.push(ok[char]*value);
        }
    }
    return [st.reduce((a,b)=>a+b,0),(index===s.length)?index:index+1];
}

function calculate(s){
    const temp=s;
    try{
        //adding end parenthesis
        s=s+')'.repeat(s.split('(').length-s.split(')').length);
        return func(s,0)[0];
    }
    catch(err){
        return temp;
    }
}


const text=document.querySelectorAll('.inp');

let check={
    '+': 'mul',
    '-': 'mul',
    '/': 'mul',
    '%': 'mul',
    'x': 'mul',
    '(': 'open',
    ')': 'close',
    '.': 'dot'
};
for(let i=0;i<=9;i++) check[i.toString()]='num';

for (let i=0;i<text.length;i++){
    text[i].addEventListener('click',function (){
        //change border color
        // text[i].style.transition="border-color 1.2s";
        // text[i].removeClass("active");
        //add this to the text
        let txt=document.querySelector('.out');
        let s=txt.innerText;
        if(text[i].innerHTML==='='){
            //need to calculate
            txt.innerHTML=calculate(s);
        }else if(text[i].innerHTML==='CE'){
            txt.innerHTML=s.substr(0,s.length-1);
            if(txt.innerHTML==='') txt.innerHTML='0';
        }else{
            addPart=text[i].innerText;
            if(check[s.substr(s.length-1,1)]==='mul'){
                if(s.substr(s.length-1,1)!=='%'){
                    if(addPart==='.' || addPart==='(') txt.innerHTML=s+addPart;
                    else if(check[addPart]==='num'){
                        if(s.substr(s.length-1,1)==='%') txt.innerHTML=s+'x'+addPart;
                        else txt.innerHTML=s+addPart;
                    }
                    else if(check[addPart]==='mul' || addPart===')') txt.innerHTML=s.substr(0,s.length-1)+addPart;
                }else{
                    if(addPart==='.' || addPart==='(' || check[addPart]==='num') txt.innerHTML=s+'x'+addPart;
                    else if(addPart==='%') txt.innerHTML=s;
                    else txt.innerHTML=s+addPart;
                }
            }else if(check[s.substr(s.length-1,1)]==='dot'){
                if(check[addPart]==='num') txt.innerHTML=s+addPart;
                else txt.innerHTML=s.substr(0,s.length-1)+addPart;
            }else if(check[s.substr(s.length-1,1)]==='num'){
                if(addPart==='(' && s==='0') txt.innerHTML=addPart;
                else if(addPart==='(') txt.innerHTML=s+'x'+addPart;
                else if(check[addPart]==='num'){
                    if(s[s.length-1]==='0' && (s.length===1 || (s.length>1 && check[s[s.length-2]]!=='num'))) txt.innerHTML=s.substr(0,s.length-1)+addPart;
                    else txt.innerHTML=s+addPart;
                }
                else txt.innerHTML=s+addPart;
            }else if(check[s.substr(s.length-1,1)]==='open'){
                if(addPart===')') txt.innerHTML=s.substr(0,s.length-1);
                else if(check[addPart]==='mul') txt.innerHTML=s;
                else txt.innerHTML=s+addPart;
            }else if(check[s.substr(s.length-1,1)]==='close'){
                if(addPart==='(' || addPart==='.' || check[addPart]==='num') txt.innerHTML=s+'x'+addPart;
                else txt.innerHTML=s+addPart;
            }
            // opening and closing brackets
            while(txt.innerText.length>1 && txt.innerText.split('(').length<txt.innerText.split(')').length){
                let brac=txt.innerHTML;
                txt.innerHTML=brac.substr(0,brac.length-1);
            }
            if(txt.innerHTML==='') txt.innerHTML='0';
        }
    });
}