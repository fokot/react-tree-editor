import {Row, Table, Text, Variable} from "./model";
import {v4 as uuidv4} from 'uuid';

export const data: Table[] = [
    new Table(uuidv4(), [
        new Row(uuidv4(), [
            new Text(uuidv4(), "aaa"),
            new Text(uuidv4(), "bbb")
        ]),
        new Row(uuidv4(), [
            new Variable(uuidv4(), "ccc"),
            new Variable(uuidv4(), "ddd")
        ]),
        new Row(uuidv4(), [
            new Variable(uuidv4(), "eee"),
        ]),
    ])
];