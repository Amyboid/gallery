
import {  useEffect } from "react";
import Home from "./routes/Home";
// import Upload from "./routes/Upload";
import { Route } from "wouter"; 
import { useAtom } from "jotai";
import { testDataAtom } from "./context";
function App() {


  const [testData,_] = useAtom(testDataAtom)
  useEffect(()=>{
    console.log('testdata',testData); 
  },[testData])
  
  return ( 
        <Home /> 
  )
}

export default App
