export class Table {
    id: string;
    children: Row[] = [];

    constructor(id: string, children: Row[]) {
        this.id = id;
        this.children = children;
    }
}

export class Row {
    id: string;
    children: Cell[] = [];

    constructor(id: string, children: Cell[]) {
        this.id = id;
        this.children = children;
    }
}

export class Text {
    id: string;
    text: string;
    span: Number = 1;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
    }
}

export class Variable {
    id: string;
    key: string;
    span: Number = 1;

    constructor(id: string, key: string) {
        this.id = id;
        this.key = key;
    }
}

// maybe interface with id and span will be better
export type Cell = Text | Variable;


