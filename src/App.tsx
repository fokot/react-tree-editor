import React, {CSSProperties} from 'react';
import logo from './logo.svg';
import './App.css';
import {NodeApi, Tree} from "react-arborist";
import {data} from "./data";
import {Table} from "./model";

const TreeComp = () =>
      <Tree
          initialData={data}
          // openByDefault={false}
          // width={600}
          // height={1000}
          // indent={24}
          // rowHeight={36}
          // overscanCount={1}
          // paddingTop={30}
          // paddingBottom={10}
          // padding={25 /* sets both */}
      >
          {Node}
      </Tree>;

// @ts-ignore
const Node = ({ node, style, dragHandle } ) =>
      <div style={style} ref={dragHandle}>
        {node.isLeaf ? "🍁" : "📁"}
        {" " + node.data.id.substring(0, 5)}
      </div>;


function App() {
  return (
    <div className="App">
      {/*<header className="App-header">*/}
      {/*  <img src={logo} className="App-logo" alt="logo" />*/}
      {/*  <p>*/}
      {/*    Edit <code>src/App.tsx</code> and save to reload.*/}
      {/*  </p>*/}
      {/*  <a*/}
      {/*    className="App-link"*/}
      {/*    href="https://reactjs.org"*/}
      {/*    target="_blank"*/}
      {/*    rel="noopener noreferrer"*/}
      {/*  >*/}
      {/*    Learn React*/}
      {/*  </a>*/}
      {/*</header>*/}
      <TreeComp />
    </div>
  );
}

export default App;
