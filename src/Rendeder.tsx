import {Cell, Element, ElementType, Row, Table} from "./model";

const TableC = (model: Table) =>
    <table key={model.id} style={{paddingBottom: "20px"}}>
        <tbody>
            {model.children.map(RowC)}
        </tbody>
    </table>;

const RowC = (model: Row) =>
    <tr key={model.id}>
        {model.children.map(CellC)}
    </tr>;

const CellC = (model: Cell) =>
    <td key={model.id} colSpan={model.span}>{model.id.substring(0, 5)}</td>;

interface RendererProps {
  model: Element[];
}

export const RendererC = ({model}: RendererProps) =>
  <div style={{display: "flex", flexDirection: "column"}}>
    {model.map(ElementC)}
  </div>;

export const ElementC = (model: Element) => {
  switch (model.kind) {
    case ElementType.Table:
      return TableC(model);
    case ElementType.Row:
      return RowC(model);
    default:
      return CellC(model);
  }
};