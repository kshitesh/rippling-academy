import { createContext } from "react";

const DataContext = createContext([[], () => {}]);
const filterContext = createContext([[], () => {}]);
const cartContext = createContext([{},()=>{}]);

export {DataContext,filterContext,cartContext};