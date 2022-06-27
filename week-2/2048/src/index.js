import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Box extends React.Component{
    render(){
        let temp=((this.props.value===null)?'null':this.props.value.toString());
        return (
            <div className={'Box Box'+this.props.index} style={{backgroundColor:'rgb('+colors[temp][0]+','+colors[temp][1]+','+colors[temp][2]+')'}}>{this.props.value}</div>
        );
    }
}

class Tab extends React.Component {
    constructor(props){
      super(props);
      this.state={boxes: Array(16).fill(null),pres:0,high_score:(JSON.parse(window.localStorage.getItem('high_score'))|| 0)};
      this.state.boxes[this.props.value]=2;
      document.addEventListener('keydown',(e)=>this.handleEvent(e));
    };
    newGame(){
        let obj=Array(16).fill(null);
        obj=this.randomize(obj);
        this.setState({boxes:obj,pres:0});
    }
    randomize(temp){
        let arr=temp.slice();
        let obj=[];
        for(let i=0;i<arr.length;i++){
            if(arr[i]===null) obj.push(i);
        }
        arr[obj[Math.floor(Math.random()*obj.length)]]=2;
        return arr;
    }
    transpose(matrix){
        for(let i=0;i<matrix.length;i++){
            for(let j=0;j<i;j++){
                let temp=matrix[i][j];matrix[i][j]=matrix[j][i];
                matrix[j][i]=temp;
            }
        }
    }
    reverse(matrix) {
        for(let i=0;i<4;i++){
            for(let j=0;j<2;j++){
                let temp=matrix[i][j];
                matrix[i][j]=matrix[i][3-j];
                matrix[i][3-j]=temp;
            }
        }
    }
    clockWise(temp){
        let matrix=temp.slice();
        this.transpose(matrix);this.reverse(matrix);
        return matrix;
    }
    antiClockWise(temp){
        let matrix=temp.slice();
        this.reverse(matrix);this.transpose(matrix);
        return matrix;
    }
    push(temp,arrow){
        let arr=temp.slice(),add=0;
        //make a 2d array
        let matrix =[];
        for(let i=0;i<4;i++){
            // console.log([arr[i*4],arr[i*4+1],arr[i*4+2],arr[i*4+3]])
            matrix.push([arr[i*4],arr[i*4+1],arr[i*4+2],arr[i*4+3]]);
        }
        //rotate
        if(arrow==='ArrowUp') matrix=this.antiClockWise(matrix);
        if(arrow==='ArrowDown') matrix=this.clockWise(matrix);
        if(arrow==='ArrowRight') {matrix=this.clockWise(matrix);matrix=this.clockWise(matrix);}
        //solve
        for(let i=0;i<4;i++){
            let obj=[],check=0;
            for(let j=0;j<4;j++){
                if(matrix[i][j]!==null){
                    if(obj.length===0) obj.push(matrix[i][j]);
                    else if(check===1) {obj.push(matrix[i][j]);check=0;}
                    else if(check===0 && matrix[i][j]===obj[obj.length-1]) {check=1;obj[obj.length-1]*=2;add=add+obj[obj.length-1];}
                    else obj.push(matrix[i][j]);
                }
            }
            for(let j=0;j<obj.length;j++) matrix[i][j]=obj[j];
            for(let j=obj.length;j<4;j++) matrix[i][j]=null;
        }
        //anti-rotate
        if(arrow==='ArrowUp') matrix=this.clockWise(matrix);
        if(arrow==='ArrowDown') matrix=this.antiClockWise(matrix);
        if(arrow==='ArrowRight') {matrix=this.clockWise(matrix);matrix=this.clockWise(matrix);}
        //return to arr
        for(let i=0;i<4;i++){
            for(let j=0;j<4;j++) arr[i*4+j]=matrix[i][j];
        }
        return [arr,add];
    }
    isEmpty(arr){
        for(let i=0;i<16;i++){
            if(arr[i]===null) return true;
        }
        return false;
    }
    isGameOver(arr){
        if(this.isEmpty(arr)) return false;
        for(let i=0;i<4;i++){
            for(let j=0;j<4;j++){
                if(i!==0 && arr[4*j+i]===arr[4*j+i-1]) return false;
                if(j!==0 && arr[4*j+i]===arr[4*(j-1)+i]) return false;
            }
        }
        return true;
    }
    handleEvent(e){
        if(e.code!=='ArrowUp' && e.code!=='ArrowDown' && e.code!=='ArrowRight' && e.code!=='ArrowLeft') return;
        let arr=this.state.boxes.slice(),value=0,score=this.state.high_score,present=this.state.pres;
        //need to push the boxes up
        [arr,value]=this.push(arr,e.code);value=value+present;
        //add a new random element
        if(this.isGameOver(arr)){
            this.newGame();
            document.querySelector('.gameOver').style.display='flex';
            for(let i=0;i<16;i++) document.querySelector('.Box'+i).style.display='none';
            document.querySelector('.Grid').style.display='flex';
            setTimeout(function (){
                document.querySelector('.gameOver').style.display='none';
                for(let i=0;i<16;i++) document.querySelector('.Box'+i).style.display='flex';
                document.querySelector('.Grid').style.display='grid'
            },1000);
            return;
        }
        arr=this.randomize(arr);
        window.localStorage.setItem('high_score', JSON.stringify(Math.max(score,value)));
        this.setState({boxes:arr,pres:value,high_score:Math.max(score,value)});
    }
    renderBox(i) {return <Box value={this.state.boxes[i]} index={i}/>;}
    render() {
      let box=[];
      for(let i=0;i<16;i++) box.push(this.renderBox(i));
      return (
        <div className='main'>
            <div className='newGame'><h1 className='header'>2048</h1><button className='new_game' onClick={()=>this.newGame()}>New Game</button></div>
            <div className='score-container'><div name='pres' className='score'>{this.state.pres}</div><div name='high_score' className='best'>{this.state.high_score}</div></div>
            <div className='Grid'><div className='gameOver'>Game Over!</div>{box}</div>
        </div>
      );
    }
  }
const colors={
    'null':[204,192,179],
    '2': [238,228,218],
    '4': [237,224,200],
    '8': [242,177,121],
    '16': [245,149,99],
    '32': [246,124,95],
    '64': [246, 94, 59],
    '128': [237, 207, 114],
    '256': [237, 204, 97],
    '512': [237, 200, 80],
    '1024': [237, 197, 63],
    '2048': [237, 194, 46]
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Tab value={Math.floor(Math.random()*16)}/>);