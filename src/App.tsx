import React, { useCallback } from "react";
import './App.css';
import {CreateHandler, MoveHandler, NodeRendererProps, Tree} from "react-arborist";
import {data, sowData} from "./data";
import {
  Element,
  ElementType,
  findElement,
  findTable,
  findParentTable,
  Row,
  Table,
  findParentRow,
  findRow, Cell
} from "./model";
import {RendererC} from "./Rendeder";
import {DeleteHandler, RenameHandler} from "react-arborist/src/types/handlers";
import {useImmer} from "use-immer";
import {v4 as uuidv4} from "uuid";

const Node = (updatersProps: UpdatersProps) => ({node, style, dragHandle}: NodeRendererProps<Element>) =>
      <div style={style} ref={dragHandle} key={node.id}>
        <NodeElem element={node.data} {...updatersProps} />
      </div>;

interface UpdatersProps {
  deleteTable: (t: Table) => void;
  addRow: (t: Table) => void;
  deleteRow: (r: Row) => void;
  addCell: (r: Row) => void;
  deleteCell: (c: Cell) => void;
  updateCell: (c: Cell) => void;
}

const NodeElem = ({element, deleteTable, addRow, deleteRow, addCell, deleteCell, updateCell}: {element: Element} & UpdatersProps)  => {
  switch (element.kind) {
    case ElementType.Table:
      return <div>📁
        <button onClick={() => deleteTable(element)}>❌</button>
        <button onClick={() => addRow(element)}>➡</button>
      </div>;
    case ElementType.Row:
      return <div>➡
        <button onClick={() => deleteRow(element)}>❌</button>
        <button onClick={() => addCell(element)}>➡</button>
      </div>;
    case ElementType.Text:
      return <div>📝
        <input value={element.text} onChange={e => updateCell({...element, text: e.target.value})}/>
        <button onClick={() => deleteCell(element)}>❌</button>
      </div>;
    case ElementType.Variable:
      return <div>🔑
        <input value={element.key} onChange={e => updateCell({...element, key: e.target.value})}/>
        <button onClick={() => deleteCell(element)}>❌</button>
      </div>;
  }
}


function App() {
  const [model, setModel] = useImmer(data);
  const [sowString, setSowString] = React.useState(JSON.stringify(sowData, null, 2));
  const onCreate: CreateHandler<Element> = ({parentId, index, type}) => {
    console.log("onCreate"); return null;};
  // const onRename: RenameHandler<Element> = ({ id, name }) => {console.log("onRename");};
  const onMove: MoveHandler<Element> = ({ dragIds, parentId, index }) => {
    setModel(
      model => {
        const element = findElement(model, dragIds[0]);
        if (element.kind === ElementType.Table) {
          return model;
        }
        if (element.kind === ElementType.Row) {
          const oldParent = findParentTable(model, element.id);
          const newParent = findTable(model, parentId || '');
          if (newParent) {
            oldParent.children = oldParent.children.filter(child => child.id && child.id !== element.id);
            newParent.children.splice(index, 0, element);
          }
        }
        if (element.kind === ElementType.Text || element.kind === ElementType.Variable) {
          const oldParent = findParentRow(model, element.id);
          const newParent = findRow(model, parentId || '');
          if (newParent) {
            oldParent.children = oldParent.children.filter(child => child.id && child.id !== element.id);
            newParent.children.splice(index, 0, element);
          }
        }
        return model;
      }
    )
  };
  // const onDelete: DeleteHandler<Element>  = ({ ids }) => {console.log("onDelete");};
  const addTable = useCallback(() => setModel(draft =>
    {draft.push({kind: ElementType.Table, id: uuidv4(), children: []})}
  ), []);
  const deleteTable = (table: Table) => setModel(model => {
    const i = model.findIndex(element => element.id === table.id);
    model.splice(i, 1);
  }
  );
  const addRow = (table: Table) => setModel(model => {
      const i = model.findIndex(element => element.id === table.id);
      model[i].children.push({kind: ElementType.Row, id: uuidv4(), children: []});
    }
  );
  const deleteRow = (r: Row) => {
    setModel(model => {
      const parent = findParentTable(model, r.id);
      parent.children = parent.children.filter(child => child.id !== r.id);
    });
  };
  const addCell = (r: Row) => {
    setModel(model => {
      // fixme
      const parent = findParentRow(model, r.id);
      parent.children.push({kind: ElementType.Text, id: uuidv4(), text: "", span: 1});
    });
  };
  const deleteCell = (c: Cell) => {
    setModel(model => {
      const parent = findParentRow(model, c.id);
      parent.children = parent.children.filter(child => child.id !== c.id);
    });
  };
  const updateCell = (c: Cell) => {};
  return (
    <div className="App" style={{display: "flex", flexDirection: "row", gap: "20px"}}>
      <div className="App" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        <button onClick={addTable}>Add 📁</button>
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
          {Node({deleteTable, addRow, deleteRow, addCell, deleteCell, updateCell})}
        </Tree>
      </div>
      <RendererC model={model} />
      <div>
        <div>Sow Data</div>
        <textarea value={sowString} onChange={e => setSowString(e.target.value)} cols={40} rows={15}/>
      </div>
    </div>
);
}

export default App;
