class HtmlTable {
    
    Items: any[] = [];
    Columns: { [propertyName: string]: string } = {};
    Rows: HTMLElement[][] = [];
    
    SelectedRows: number[] = [];
    
    TableContainer: HTMLElement;
    DragInterval: number | null = null;
    
    constructor (container: HTMLElement) {
        this.TableContainer = container;
        window.addEventListener ("pointerup", () => {
            if (this.DragInterval) {
                clearInterval (this.DragInterval);
            }
            
            this.DragInterval = null;
        });
    }
    
    public AddItem (newItem: any) {
        
    }
    
    public RemoveSelectedItems () {
        this.SelectedRows.sort ((a, b) => { return b - a; }).forEach (row => {
            this.Rows[row].forEach (element => {
                element.remove ();
            });
            
            this.Rows.splice (row, 1);
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
    
    public SelectRow (appendToggle: boolean, row: number) {
        if (appendToggle) {
            if (this.SelectedRows.some (x => x == row)) {
                this.SelectedRows = this.SelectedRows.filter (x => x != row);
                this.Rows[row].forEach (cell => {
                    cell.classList.remove ("selected");
                });
            } else {
                this.SelectedRows.push (row);
                this.Rows[row].forEach (cell => {
                    cell.classList.add ("selected");
                });
            }
        } else {
            this.SelectedRows.forEach (rowNumber => {
                this.Rows[rowNumber].forEach (cell => {
                    cell.classList.remove ("selected");
                });
            });
            this.SelectedRows = [row];
            this.Rows[row].forEach (cell => {
                cell.classList.add ("selected");
            });
        }
    }
    
    public RebuildTable () {
        
        if (Object.getOwnPropertyNames (this.Columns).length == 0) {
            console.log (this);
            console.log ("No columns were set.");
            return
        }
        
        let tableElement: HTMLElement = document.createElement ("div");
        tableElement.classList.add ("content-table");
        
        this.Rows = [];
        let colCount = Object.getOwnPropertyNames (this.Columns).length;
        
        for (let i = 0; i < this.Items.length; ++i) {
            this.Rows.push (new Array<HTMLElement> (colCount));
        }
        
        let x = 0;
        for (let columnID in this.Columns) {
            let column = document.createElement ("div");
            column.classList.add ("content-column");
            
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
            columnHeader.innerHTML = this.Columns[columnID];
            column.appendChild (columnHeader);
            
            for (let y = 0; y < this.Items.length; ++y) {
                let columnCell = document.createElement ("div");
                columnCell.classList.add ("content-cell");
                columnCell.setAttribute ("data-tableRow", y.toString ());
                columnCell.addEventListener ("pointerdown", (e) => {
                    console.log (e.ctrlKey);
                    console.log (y);
                    this.SelectRow (e.ctrlKey, y);
                });
                let cellField = new EditableField (this.Items[y], columnID, columnCell);
                
                this.Rows[y][x] = columnCell;
                
                column.appendChild (columnCell);
            }
            
            tableElement.appendChild (column);
            ++x;
        }
        
        this.TableContainer.innerHTML = "";
        this.TableContainer.appendChild (tableElement);
    }
    
}
/*
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
            HtmlTable
        } else {
            
        }
        
    }
});*/