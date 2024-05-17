export enum ElementType {
  Table, Row, Text, Variable
}

export type Element = Table | Row | Text | Variable;
export type ParentElement = Table | Row;

export const findElement = (model: Table[], id: string): Element => {
  for (const element of model) {
    if (element.id === id) {
      return element;
    }
    for (const row of element.children) {
      if (row.id === id) {
        return row;
      }
      for (const cell of row.children) {
        if (cell.id === id) {
          return cell;
        }
      }
    }
  }
  throw new Error( `no element found for ${id}`);
}

export const findParentTable = (model: Table[], id: string): Table => {
  for (const element of model) {
    if (element.children.some(row => row.id === id)) {
      return element;
    }
  }
  throw new Error( `no table parent found for ${id}`);
}

export const findTable = (model: Table[], id: string): Table => {
  for (const element of model) {
    if (element.id === id) {
      return element;
    }
  }
  throw new Error( `no table found for ${id}`);
}

export const findParentRow = (model: Table[], id: string): Row => {
  for (const element of model) {
    for (const row of element.children) {
      if (row.children.some(cell => cell.id === id)) {
        return row;
      }
    }
  }
  throw new Error( `no row parent found for ${id}`);
}

export const findRow = (model: Table[], id: string): Row => {
  for (const element of model) {
    for (const row of element.children) {
      if (row.id === id) {
        return row;
      }
    }
  }
  throw new Error( `no row found for ${id}`);
}

export interface Table {
  kind: ElementType.Table;
  id: string;
  children: Row[];
}

export interface Row {
  kind: ElementType.Row;
  id: string;
  children: Cell[];
}

export interface Text {
  kind: ElementType.Text;
  id: string;
  text: string;
  span: number;
}

export interface Variable {
  kind: ElementType.Variable;
  id: string;
  key: string;
  span: number;
}

// maybe interface with id and span will be better
export type Cell = Text | Variable;


