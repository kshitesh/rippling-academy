// import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
const carList = [
    {
      name: "BMW M6",
      url:
        "https://mediapool.bmwgroup.com/cache/P9/201411/P90169551/P90169551-the-new-bmw-m6-coup-exterior-12-2014-600px.jpg",
      releaseYear: 2020
    },
    {
      name: "VW Polo",
      url:
        "https://cdn.euroncap.com/media/30740/volkswagen-polo-359-235.jpg?mode=crop&width=359&height=235",
      releaseYear: 2018
    },
    {
      name: "Audi S6",
      url:
        "https://www.motortrend.com/uploads/sites/5/2020/03/6-2020-audi-s6.jpg?fit=around%7C875:492.1875",
      releaseYear: 2020
    },
    {
      name: "BMW M2",
      url:
        "https://imgd.aeplcdn.com/0x0/cw/ec/37092/BMW-M2-Exterior-141054.jpg?wm=0",
      releaseYear: 2019
    },
    {
      name: "Audi A3",
      url: "https://cdn.motor1.com/images/mgl/BEooZ/s3/2021-audi-s3.jpg",
      releaseYear: 2019
    }
  ];

class Car extends React.Component{
  render(){
    return(
      <div className='car'>
        <div className='carName'>Name: {carList[this.props.value].name}</div>
        <div className='carYear'>Year: {carList[this.props.value].releaseYear}</div>
        <img src={carList[this.props.value].url} alt='car' className='image'/>
      </div>
    )
  }
}

class Brand extends React.Component{
  render(){
    let brandOpt=[];
    brandOpt.push(<option value='all'>all</option>)
    for(let i=0;i<brandArr.length;i++){
      brandOpt.push(<option value={brandArr[i]}>{brandArr[i]}</option>)
    }
    return (
      <div className='FilterBy'>
        <label >Filter by Brand: </label>
        <select name='brand' id='brand' onChange={(e)=>{this.props.handleBrand(e.target.value)}}>
          {brandOpt}
        </select>
      </div>
    )
  }
}

class Button extends React.Component{
  render(){
    return (
      <button className={'button year'+this.props.text} onClick={(e)=>{this.props.year(e.target.innerText)}}>
        {this.props.text}
      </button>
    )
  }
}

class Year extends React.Component{
  year=(e)=>{this.props.handleYear(e)}
  renderButton(year){
    return <Button text={year} year={this.year}/>
  }
  render(){
    let yearOpt=[];
    for(let i=0;i<yearArr.length;i++){
      yearOpt.push(this.renderButton(yearArr[i]));
    }
    return (
      <div>
        <div className='FilterBy'>Filter by Year: </div>
        <div className='yearButton'>{yearOpt}</div>
      </div>
    );
  }
}

class Data extends React.Component{
  renderBox(i){
    return <Car value={i}/>
  }
  render(){
    let arr=[];
    for(let i=0;i<carList.length;i++){
      if((this.props.value.brand===carList[i].name.split(' ')[0] || this.props.value.brand==='all') && (this.props.value.year===carList[i].releaseYear.toString() || this.props.value.year==='all')){
        arr.push(this.renderBox(i));
      }
    }
    return <div className='Data'>{arr}</div>;
  }
}

class Tab extends React.Component {
  constructor(props){
    super(props);
    this.state={brand:'all', year:'all'}
  };
  handleBrand=(temp) =>{this.setState({brand:temp});}
  handleYear=(temp) =>{
    //undo the color for this.state button
    if(this.state.year===temp) temp='all';
    if(this.state.year!=='all')  {document.querySelector('.year' + this.state.year).style.backgroundColor='';}
    if(temp!=='all')  document.querySelector('.year' + temp).style.backgroundColor='greenyellow';
    this.setState({year:temp});
  }
  render() {
    return (
      <div>
        <Brand handleBrand={this.handleBrand}/>
        <Year handleYear={this.handleYear}/>
        <Data value={this.state}/>
      </div>
    );
  }
}
//need to get brand list and year list
let brandArr=[],yearArr=[];
for(let i=0;i<carList.length;i++){
  brandArr.push(carList[i].name.split(' ')[0]);yearArr.push(carList[i].releaseYear);
}
brandArr=[...new Set(brandArr)];yearArr=[...new Set(yearArr)];
// for(let i=1950;i<2018;i++) yearArr.push(i.toString());
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Tab />);