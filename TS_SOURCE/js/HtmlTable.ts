class HtmlTable {
    
    Items: any[] = [];
    ColumnsDefinitions: { [propertyName: string]: string } = {};
    
    Columns: { [columnID: string]: HTMLElement } = {};
    Rows: { [rowID: number]: [HTMLElement[], any] } = {};
    
    static RowCounter: number = 1;
    SelectedRows: number[] = [];
    
    readonly TableContainer: HTMLElement;
    readonly TableElement: HTMLElement;
    DragInterval: number | null = null;
    
    constructor (container: HTMLElement) {
        this.TableContainer = container;
        
        this.TableElement = document.createElement ("div");
        this.TableElement.classList.add ("content-table");
        
        this.TableContainer.innerHTML = "";
        this.TableContainer.appendChild (this.TableElement);
        
        window.addEventListener ("pointerup", () => {
            if (this.DragInterval) {
                clearInterval (this.DragInterval);
            }
            
            this.DragInterval = null;
        });
        
        window.addEventListener ("pointerdown", (e) => {
            if (e.srcElement) {
                let currentElement: Element | null = e.srcElement;
                let pressedOnRow: number | null = null;
                
                let i : number | string | null;
                while (currentElement != null) {
                    
                    if (i = currentElement.getAttribute ("data-tableRow")) {
                        pressedOnRow = parseInt (i);
                        break;
                    }
                    
                    currentElement = currentElement.parentElement;
                }
                
                if (pressedOnRow) {
                    this.SelectRow (e.ctrlKey, pressedOnRow);
                } else {
                    
                }
                
            }
        });
    }
    
    public static AutoGenerateColumns (exampleObject: any) {
        let output: { [propertyName: string]: string } = {};
        
        for (let i in exampleObject) {
            if (typeof exampleObject[i] == "function") {
                continue;
            }
            
            output[i] = i.toUpperCase ();
        }
        
        return output;
    }
    
    public AddItem (newItem: any) {
        this.Items.push (newItem);
        this.Rows[HtmlTable.RowCounter] = [Array<HTMLElement> (Object.getOwnPropertyNames (this.ColumnsDefinitions).length), newItem];
        let x = 0;
        for (let columnID in this.ColumnsDefinitions) {
            let columnCell = document.createElement ("div");
            columnCell.classList.add ("content-cell");
            columnCell.setAttribute ("data-tableRow", (HtmlTable.RowCounter).toString ());
            let cellField = new EditableField (newItem, columnID, columnCell);
            
            this.Rows[HtmlTable.RowCounter][0][x] = columnCell;
            
            this.Columns[columnID].appendChild (columnCell);
            ++x;
        }
        ++HtmlTable.RowCounter;
    }
    
    public RemoveSelectedItems () {
        this.SelectedRows.forEach (row => {
            this.Rows[row][0].forEach (element => {
                element.remove ();
            });
            
            this.Items.splice (this.Items.indexOf (this.Rows[row][1]), 1);
            delete this.Rows[row];
        });
        
        this.SelectedRows = [];
    }
    
    public SelectRow (appendToggle: boolean, row: number) {
        if (appendToggle) {
            if (this.SelectedRows.some (x => x == row)) {
                this.SelectedRows = this.SelectedRows.filter (x => x != row);
                this.Rows[row][0].forEach (cell => {
                    cell.classList.remove ("selected");
                });
            } else {
                this.SelectedRows.push (row);
                this.Rows[row][0].forEach (cell => {
                    cell.classList.add ("selected");
                });
            }
        } else {
            this.SelectedRows.forEach (rowNumber => {
                this.Rows[rowNumber][0].forEach (cell => {
                    cell.classList.remove ("selected");
                });
            });
            this.SelectedRows = [row];
            this.Rows[row][0].forEach (cell => {
                cell.classList.add ("selected");
            });
        }
    }
    
    public RebuildTable () {
        
        if (Object.getOwnPropertyNames (this.ColumnsDefinitions).length == 0) {
            console.log (this);
            console.log ("No columns were set.");
            return
        }
        
        let ItemsBackup: any[] = new Array<any> ().concat (this.Items);
        this.Items = [];
        
        this.SelectedRows = [];
        for (let i in this.Rows) {
            this.SelectedRows.push (parseInt (i));
        }
        
        this.RemoveSelectedItems ();
        
        this.TableElement.innerHTML = "";
        
        this.Columns = {};
        
        for (let columnID in this.ColumnsDefinitions) {
            let column = document.createElement ("div");
            column.classList.add ("content-column");
            this.Columns[columnID] = column;
            
            let columnResizer = document.createElement ("div");
            columnResizer.classList.add ("content-column-resizer");
            columnResizer.setAttribute ("data-FieldID", "-1");
            columnResizer.onpointerdown = () => {
                let originalX = Input.MouseX;
                let originalWidth = column.style.width ? parseInt (column.style.width) : 400;
                this.DragInterval = setInterval (() => {
                    let newWidth = originalWidth + Input.MouseX - originalX;
                    newWidth = Math.max (24, newWidth);
                    column.style.width = `${newWidth}px`;
                }, 10);
            }
            column.appendChild (columnResizer);
            
            let columnHeader = document.createElement ("div");
            columnHeader.classList.add ("content-header");
            columnHeader.innerHTML = this.ColumnsDefinitions[columnID];
            column.appendChild (columnHeader);
            
            this.TableElement.appendChild (column);
        }
        
        for (let i of ItemsBackup) {
            this.AddItem (i);
        }
    }
    
}