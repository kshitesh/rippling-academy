function winCheck(test,i){
    let p=i%3,q=Math.floor(i/3);
    if(test[q*3].innerHTML===test[q*3+1].innerHTML && test[q*3].innerHTML===test[q*3+2].innerHTML) return true;
    if(test[p].innerHTML===test[p+3].innerHTML && test[p+6].innerHTML===test[p].innerHTML) return true;
    if(p===q && q===1){
        if(test[0].innerHTML===test[4].innerHTML && test[0].innerHTML===test[8].innerHTML) return true;
        if(test[2].innerHTML===test[4].innerHTML && test[2].innerHTML===test[6].innerHTML) return true;
    }
    if((i===0 || i===8) && test[0].innerHTML===test[4].innerHTML && test[0].innerHTML===test[8].innerHTML) return true;
    if((i===2 || i===6) && test[2].innerHTML===test[4].innerHTML && test[2].innerHTML===test[6].innerHTML) return true;
    return false;
}

function isFilled(){
    const idk=document.querySelectorAll('.state');
    for(let i=0;i<9;i++){
        if(idk[i].innerHTML==='') return false;
    }
    return true;
}

function restart(){
    char=0;
    document.querySelector('.turn').innerText='X turn';
    for(let i=0;i<9;i++) inp[i].innerHTML='';
}

function design(i){
    inp[i].innerHTML=((char===1)?'O':'X');
    if(winCheck(inp,i)){
        //increment the counter
        const idk=Number(document.querySelector('.'+((char===1)?'o':'x')+'-count').innerText)+1;
        document.querySelector('.'+((char===1)?'o':'x')+'-count').innerText=idk;
        //restart the game
        const char_prev=char;
        restart();
        //2 second delay
        const str=('.'+((char_prev===1)?'o':'x'));
        document.querySelector(str).style.display='flex';
        for(let k=0;k<9;k++) inp[k].style.display='none';
        const myTimeout = setTimeout(function(){
            document.querySelector(str).style.display='none';
            for(let k=0;k<9;k++) inp[k].style.display='inline';
        },1500);
    }else if(isFilled()){
        restart();
        document.querySelector('.draw').style.display='flex';
        for(let k=0;k<9;k++) inp[k].style.display='none';
        const myTimeout = setTimeout(function(){
            document.querySelector('.draw').style.display='none';
            for(let k=0;k<9;k++) inp[k].style.display='inline';
        },1500);
    }
    else {char=(char+1)%2;document.querySelector('.turn').innerText=((char===1)?'O turn':'X turn');}
}

function filled(arr){
    for(let i=0;i<9;i++){
        if(arr[i].innerHTML===' ') return false;
    }
    return true;
}

function move(arr,player){
    let p='',check=false,value1,value2;
    for(let i=0;i<9;i++) p=p+arr[i].innerHTML;
    p+=player;
    //state
    if(dp.hasOwnProperty(p)) return dp.p;
    for(let i=0;i<9;i++){
        if(arr[i].innerHTML!==' ') continue;
        arr[i].innerHTML=((player==='X')?'X':'O');
        if(winCheck(arr,i)){
            dp.p=[i,'win'];
            return dp.p;
        }
        if(filled(arr)) {dp.p=[i,'draw'];return dp.p;}
        let next=move(arr,((player==='X')?'O':'X'))
        if(next[1]==='lose') {dp.p=[i,'win'];return dp.p;}
        if(next[1]==='draw') {check=true;value1=i;}
        if(next[1]==='win') value2=i;
        arr[i].innerHTML=' ';
    }
    if(check) dp.p=[value1,'draw'];
    else dp.p=[value2,'lose'];
    return dp.p;
}

function bestMove(){
    let arr=[];
    for(let i=0;i<9;i++) {arr[i]={};arr[i].innerHTML=inp[i].innerHTML;if(arr[i].innerHTML==='') arr[i].innerHTML=' ';}
    console.log(move(arr,'O'));
    return move(arr,'O')[0];
}

let char=0,dp={};
const inp=document.querySelectorAll('.state');
for(let i=0;i<inp.length;i++){
    inp[i].addEventListener('click',function(){
        if(char===0 && inp[i].innerHTML==='') {
            design(i);
            if(char===1 && gameMode.options[gameMode.selectedIndex].text==='One player') {let asdfa=bestMove();design(asdfa);}
        }
        else if(char===1 && inp[i].innerHTML==='' && gameMode.options[gameMode.selectedIndex].text==='Two player') design(i);
    });
}


//setting the game mode
const gameMode=document.querySelector('.mode');

// twoPlayer();
gameMode.addEventListener('change',function(){
    document.querySelector('.x-count').innerText='0';
    document.querySelector('.o-count').innerText='0';
    restart();
});

const re=document.querySelector('.button');
re.addEventListener('click',restart);
