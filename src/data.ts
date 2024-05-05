import {ElementType, Element} from "./model";
import {v4 as uuidv4} from 'uuid';

export const data: Element[] = [
  {
    kind: ElementType.Table,
    id: uuidv4(),
    children: [
      { kind: ElementType.Row,
        id: uuidv4(),
        children: [
          { kind: ElementType.Text, id: uuidv4(), text: "aaa", span: 1 },
          { kind: ElementType.Text, id: uuidv4(), text: "bbb", span: 1 }
        ]},
      { kind: ElementType.Row,
        id: uuidv4(),
        children: [
          { kind: ElementType.Variable, id: uuidv4(), key: "ccc", span: 1 },
          { kind: ElementType.Variable, id: uuidv4(), key: "ddd", span: 1 }
        ]},
    ]},
  {
    kind: ElementType.Table,
    id: uuidv4(),
    children: [
      { kind: ElementType.Row,
        id: uuidv4(),
        children: [
          { kind: ElementType.Text, id: uuidv4(), text: "eee", span: 1 },
          { kind: ElementType.Text, id: uuidv4(), text: "fff", span: 1 }
        ]}
    ]}
];