import {Cell, ElementType, Row, Table, Text} from "./model";
import {useContext} from "react";
import {EditingContext} from "./App";

const border = "black solid 1px";
const minHeight = "22px";

const TableC = (model: Table, sow: Object) =>
    <table key={model.id} style={{marginBottom: "20px", borderCollapse: "collapse", minHeight, border}}>
        <tbody>
            {model.children.map(r => RowC(r, sow))}
        </tbody>
    </table>;

const RowC = (model: Row, sow: Object) =>
    <tr key={model.id} style={{minHeight, border}}>
        {model.children.map(c => CellC(c, sow))}
    </tr>;

const CellC = (model: Cell, sow: Object) => {
  switch (model.kind) {
    case ElementType.Text:
        return <TextC key={model.id} model={model} />;
    case ElementType.Variable:
      // @ts-ignore
      const text = sow[model.key] as string || `?${model.key}?`;
      return <td key={model.id} colSpan={model.span}>{text}</td>;
  }
};

const TextC = ({model}: {model: Text}) => {
  const [editing, setEditing] = useContext(EditingContext)!;
  if (model.id === editing.id) {
    return <td colSpan={model.span}>{editing.text}</td>;
  } else {
    return <td colSpan={model.span}>{model.text}</td>;
  }
}


interface RendererProps {
  model: Table[];
  sow: Object;
}

export const RendererC = ({model, sow}: RendererProps) =>
  <div style={{display: "flex", flexDirection: "column"}}>
    {model.map(t => TableC(t, sow))}
  </div>;
