interface ITableElement<T> {
    
    EditableFields: EditableField[];
    OnTableDraw: (rowElements: HTMLElement[]) => void;
    ColumnSortDependencies: () => { [columnID: string]: string[] };
    ColumnSorts: () => { [columnID: string]: (a: T, b: T) => number };
    
}