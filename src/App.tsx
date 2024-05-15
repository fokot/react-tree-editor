import React, { useCallback } from "react";
import './App.css';
import {CreateHandler, MoveHandler, NodeRendererProps, Tree} from "react-arborist";
import {data} from "./data";
import {
  Element,
  ElementType,
  findElement,
  findTable,
  findParentTable,
  Row,
  Table,
  findParentRow,
  findRow
} from "./model";
import {RendererC} from "./Rendeder";
import {DeleteHandler, RenameHandler} from "react-arborist/src/types/handlers";
import { useImmer } from "use-immer";
import {v4 as uuidv4} from "uuid";

const Node = ({node, style, dragHandle}: NodeRendererProps<Element>) =>
      <div style={style} ref={dragHandle} key={node.id}>
        {icon(node.data.kind)}
        {" " + node.data.id.substring(0, 5)}
      </div>;

const icon = (elementType: ElementType)  => {
  switch (elementType) {
    case ElementType.Table:
      return "📁";
    case ElementType.Row:
      return "➡";
    case ElementType.Text:
      return "📝";
    case ElementType.Variable:
      return "🔑";
  }
}


function App() {
  const [model, setModel] = useImmer(data);
  const onCreate: CreateHandler<Element> = ({ parentId, index, type }) => {console.log("onCreate"); return null;};
  const onRename: RenameHandler<Element> = ({ id, name }) => {console.log("onRename");};
  const onMove: MoveHandler<Element> = ({ dragIds, parentId, index }) => {
    setModel(
      model => {
        const tables = model as Table[];
        const element = findElement(tables, dragIds[0]);
        if (element.kind === ElementType.Table) {
          return model;
        }
        if (element.kind === ElementType.Row) {
          const oldParent = findParentTable(tables, element.id);
          const newParent = findTable(tables, parentId || '');
          if (newParent) {
            oldParent.children = oldParent.children.filter(child => child.id && child.id !== element.id);
            newParent.children.splice(index, 0, element);
          }
        }
        if (element.kind === ElementType.Text || element.kind === ElementType.Variable) {
          const oldParent = findParentRow(tables, element.id);
          const newParent = findRow(tables, parentId || '');
          if (newParent) {
            oldParent.children = oldParent.children.filter(child => child.id && child.id !== element.id);
            newParent.children.splice(index, 0, element);
          }
        }
        return model;
      }
    )
  };
  const onDelete: DeleteHandler<Element>  = ({ ids }) => {console.log("onDelete");};
  const addTable = useCallback(() => setModel(draft =>
  {draft.push({kind: ElementType.Table, id: uuidv4(), children: []})}
  ), []);
  return (
    <div className="App" style={{display: "flex", flexDirection: "row"}}>
      <div className="App" style={{display: "flex", flexDirection: "column"}}>
        <button onClick={addTable}>Add table</button>
        <Tree
          data={model}
          onCreate={onCreate}
          // onRename={onRename}
          onMove={onMove}
          // onDelete={onDelete}
          // openByDefault={false}
          // width={600}
          // height={1000}
          // indent={24}
          // rowHeight={36}
          // overscanCount={1}
          // paddingTop={30}
          // paddingBottom={10}
          // padding={25 /* sets both */}
          // renderDragPreview={Node}
        >
          {Node}
        </Tree>
      </div>
      <RendererC model={model} />
    </div>
  );
}

export default App;
