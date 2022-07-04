import React, { useEffect, useState, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './index.css';
import {DataContext, filterContext, cartContext} from './Context.js'

function Header({value,buttonName}){
    return (
        <div className='wrapper'>
            <div className='Head'>
                <Link to='/' className='removeUnderline'><span className='appName'>App Name</span></Link>
                <Link to={value}><button className='addressButton'>{buttonName}</button></Link>
            </div>
        </div>
    )
}

function Button({value}){
    function eventHandler(k){
        let copyCart=JSON.parse(JSON.stringify(cart));
        if(!(value.id.toString() in copyCart)) copyCart[value.id.toString()]=[0,value.image,value.title,value.price,value.description];
        copyCart[value.id.toString()][0]+=k;
        if(copyCart[value.id.toString()][0]<=0) delete copyCart[value.id.toString()];
        setCart(copyCart);
    }
    const [cart,setCart]=useContext(cartContext);
    //cart options
    if(value.id in cart){
        return (
            <div className='quantityButtons'>
                <button onClick={()=>eventHandler(-1)} className='smallButton'>-</button>
                <span>{cart[value.id][0]}</span>
                <button onClick={()=>eventHandler(1)} className='smallButton'>+</button>
            </div>
        );
    }
    return (
        <div className='buttons'>
            <button onClick={()=>eventHandler(1)} className='button'>add to cart</button>
        </div>
    );
}

function Box({value}){
    return (
        <div className='Flex productBox'>
            <div className='details'>
                <div>Name: {value.title}</div>
                <div>Price: {value.price}</div>
                <div>Rating: {value.rating.rate}</div>
            </div>
            <img src={value.image} alt='car' className='image'/>
            <Button value={value}/>
        </div>
    )
}

function Data(){
    function isValidCategory(check,s,arr,data){
        let temp=false;
        for(let i=0;i<check.length;i++){
            temp=temp | check[i];
            if(check[i] && arr[i]===data[s]) return true;
        }
        if(temp) return false;
        return true;
    }
    function isValidPrice(check,s,value,data){
        if(check[0]===check[1]) return true;
        if(check[0]){
            if((+data[s])<value) return true;
            return false;
        }
        if((+data[s])<value) return false;
        return true;
    }

    const [filter,]=useContext(filterContext),[data,]=useContext(DataContext);
    let arr=[];
    for(let i=0;i<data.length;i++){
        //category and price filter
        if(isValidCategory(filter[0],'category',['electronics','jewelery','men\'s clothing', 'women\'s clothing'],data[i]) && isValidPrice(filter[1],'price',250,data[i])) arr.push(data[i]);
    }
    if(filter[2]) arr.sort(function (a,b){return (Number(b.rating.rate)-Number(+a.rating.rate))});
    return (
        <div className='Grid dataTab'>
            {arr.map((element)=><Box value={element}/>)}
        </div>
    )
}

function Filter(){
    const [filter,setFilter]=useContext(filterContext);
    const arr=[['electronics','jewelery','men\'s clothing', 'women\'s clothing'],['<250','>=250'],'sort by ratings'];
    function eventHandler(e){
        let copyFilter=[...filter];
        if(e.target.id.split(' ').length===2) copyFilter[+e.target.id.split(' ')[0]][+e.target.id.split(' ')[1]]=e.target.checked;
        else copyFilter[+e.target.id]=e.target.checked;
        setFilter(copyFilter);
    }
    return (
        <fieldset className='filterTab'>
            <legend>Filter</legend>
            {arr.map((element,i)=>{
                if(Array.isArray(element)){
                    return element.map((ele,j)=>{return <div><input id={i+' '+j} type="checkbox" checked={filter[i][j]} onClick={(e)=>eventHandler(e)}/><label>{ele}</label></div>});
                }
                return <div><input id={i.toString()} type="checkbox" checked={filter[i]} onClick={(e)=>eventHandler(e)}/><label>{element}</label></div>;
            })}
        </fieldset>
    )
}

function MainPage(){
    const filter=useState([[false,false,false,false],[false,false],false]);
    return (
        <div>
            <Header value={'/checkout/'} buttonName={'cart'}/>
            <filterContext.Provider value={filter}>
                <Filter/>
                <Data/>
            </filterContext.Provider>
        </div>
    )
}

function List(){
    const [cart,]=useContext(cartContext);
    let arr=[],arr2=[];
    Object.keys(cart).forEach((key)=>{
        arr.push(cart[key]);
        arr2.push({
            'id': key,
            'image': cart[key][1],
            'title': cart[key][2],
            'price': cart[key][3],
            'description': cart[key][4]
        })
    });
    return (
        <div className='Flex'>
            {arr.map((element,index)=>{
                return (
                <div className='Flex'>
                    <div className='imageAndButton'><img src={element[1]} alt='product' className='cartImage'/><Button value={arr2[index]}/></div>
                    <text>Name: {element[2]}</text>
                    <text>Price: {element[3]}</text>
                    <text>Description: {element[4]}</text>
                </div>);
            })}
        </div>
    );
}

function PlaceOrder(){
    const [cart,]=useContext(cartContext);
    if(Object.keys(cart).length===0){
        return <div className='emptyCart'>Cart is empty</div>;
    }
    return <div className='buy'><button className='buyButton'>Place Order</button></div>;
}

function CheckOut(){
    return (
        <div>
            <Header value={'/'} buttonName={"home"}/>
            <List />
            <PlaceOrder/>
        </div>
    );
}

function App(){
    const cart=useState({});
    const [data,setData]=useState([]);
    useEffect(()=>{
        if(JSON.parse(window.localStorage.getItem('Data'))!==null) {setData(JSON.parse(window.localStorage.getItem('Data')));return;}
        const res= fetch('https://fakestoreapi.com/products');
        res.then((event)=>{return event.json()}).then((event)=>{window.localStorage.setItem('Data', JSON.stringify(event));setData(event)});
    },[]);
    return (
        <cartContext.Provider value={cart}>
            <DataContext.Provider value={[data,setData]}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<MainPage/>}/>
                        <Route path='/checkout' element={<CheckOut/>}/>
                    </Routes>
                </BrowserRouter>
            </DataContext.Provider>
        </cartContext.Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);