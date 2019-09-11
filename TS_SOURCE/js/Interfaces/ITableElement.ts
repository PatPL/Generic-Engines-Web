interface ITableElement<T> {
    
    EditableFields: EditableField[];
    OnTableDraw: (rowElements: HTMLElement[]) => void;
    ColumnSorts: () => { [columnID: string]: (a: T, b: T) => number };
    
}