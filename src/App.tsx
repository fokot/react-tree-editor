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
  Text,
  findParentRow,
  findRow, Cell, AllSowKeys, SowKey
} from "./model";
import {RendererC} from "./Rendeder";
import {useImmer} from "use-immer";
import {v4 as uuidv4} from "uuid";
import createFastContext from "./createFastContext";

const Node = (updatersProps: UpdatersProps) => ({node, style, dragHandle}: NodeRendererProps<Element>) =>
      <div style={style} ref={dragHandle} key={node.id}>
        <NodeElem element={node.data} {...updatersProps} />
      </div>;

interface UpdatersProps {
  deleteTable: (t: Table) => void;
  addRow: (t: Table) => void;
  deleteRow: (r: Row) => void;
  addText: (r: Row) => void;
  addVariable: (r: Row) => void;
  deleteCell: (c: Cell) => void;
  updateCell: (c: Cell) => void;
}

const NodeElem = ({element, deleteTable, addRow, deleteRow, addText, addVariable, deleteCell, updateCell}: {element: Element} & UpdatersProps)  => {
  switch (element.kind) {
    case ElementType.Table:
      return <div style={{float: "left"}}>📁
        <button onClick={() => deleteTable(element)}>❌</button>
        <button onClick={() => addRow(element)}>➡️</button>
      </div>;
    case ElementType.Row:
      return <div style={{float: "left"}}>➡️
        <button onClick={() => deleteRow(element)}>❌</button>
        <button onClick={() => addText(element)}>📝</button>
        <button onClick={() => addVariable(element)}>🐖</button>
      </div>;
    case ElementType.Text:
      return <TextElem element={element}  deleteCell={deleteCell} updateCell={updateCell}/>;
    case ElementType.Variable:
      return <div style={{float: "left"}}>🐖
        <select defaultValue={element.key} onChange={e => updateCell({...element, key: e.target.value as SowKey})}>
          {AllSowKeys.map(key => <option key={key} value={key}>{key}</option>)}
        </select>
        <button onClick={() => deleteCell(element)}>❌</button>
        <input type="number" defaultValue={element.span} min="1" max="5" onChange={e => updateCell({...element, span: parseInt(e.target.value)})}/>
      </div>;
  }
}

const TextElem = ({element, deleteCell, updateCell}: {
  element: Text,
  deleteCell: (c: Cell) => void,
  updateCell: (c: Cell) => void,
}) => {
  const [editing, setEditing] = useStore(a => a);
  return <div style={{float: "left"}}>📝
    <input id={element.id} value={element.id === editing.id ? editing.text : element.text}
     onChange={e => {setEditing({id: element.id, text: e.target.value})}}
     onBlur={e => updateCell({...element, text: e.target.value})}
    />
    <button onClick={() => deleteCell(element)}>❌</button>
    <input type="number" defaultValue={element.span} min="1" max="5" onChange={e => updateCell({...element, span: parseInt(e.target.value)})}/>
  </div>;
};

interface Editing {
  id: string;
  text: string;
}

export const { Provider, useStore } = createFastContext<Editing>({
  id: "",
  text: "",
});

function App() {
  const [model, setModel] = useImmer(data);
  const [sowString, setSowString] = React.useState(JSON.stringify(sowData, null, 2));
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
  const addText = (r: Row) => {
    setModel(model => {
      const parent = findRow(model, r.id);
      parent.children.push({kind: ElementType.Text, id: uuidv4(), text: "", span: 1});
    });
  };
  const addVariable = (r: Row) => {
    setModel(model => {
      const parent = findRow(model, r.id);
      parent.children.push({kind: ElementType.Variable, id: uuidv4(), key: AllSowKeys[0], span: 1});
    });
  };
  const deleteCell = (c: Cell) => {
    setModel(model => {
      const parent = findParentRow(model, c.id);
      parent.children = parent.children.filter(child => child.id !== c.id);
    });
  };
  const updateCell = (c: Cell) => {
    setModel(model => {
      const parent = findParentRow(model, c.id);
      const i = parent.children.findIndex(child => child.id === c.id);
      parent.children[i] = c;
    });
  };
  return (
    <Provider>
      <div className="App" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        <div className="App" style={{display: "flex", flexDirection: "row", gap: "20px", height: "500px"}}>
          <div className="App" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
            <button onClick={addTable}>📁</button>
            <Tree
              data={model}
              onMove={onMove}
              height={480}
            >
              {Node({deleteTable, addRow, deleteRow, addText, addVariable, deleteCell, updateCell})}
            </Tree>
          </div>
          <RendererC model={model} sow={JSON.parse(sowString) || {}} />
          <div>
            <div>Sow Data</div>
            <textarea value={sowString} onChange={e => setSowString(e.target.value)} cols={40} rows={15}/>
          </div>
        </div>
        <div style={{textAlign: "left"}}>
          <h1>Legend:</h1>
          📁 - table<br/>
          ➡️ - row<br/>
          📝 - static text<br/>
          🐖 - sow data<br/>
          ❌ - delete element<br/>
          You can also drag elements to reorder them.
        </div>
      </div>
    </Provider>
);
}

export default App;
