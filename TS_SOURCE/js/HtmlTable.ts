class HtmlTable {
    
    Items: any[] = [];
    ColumnsDefinitions: { [propertyName: string]: IColumnInfo } = {};
    
    Columns: { [columnID: string]: HTMLElement } = {};
    Rows: { [rowID: number]: [HTMLElement[], any] } = {};
    
    static RowCounter: number = 1;
    SelectedRows: number[] = [];
    
    readonly TableContainer: HTMLElement;
    TableElement: HTMLElement;
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
            //Ignore if MMB pressed
            if (e.button == 1) {
                return;
            }
            
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
                    this.SelectRow (e.ctrlKey, pressedOnRow, e.shiftKey);
                } else {
                    
                }
                
            }
        });
    }
    
    public static AutoGenerateColumns (exampleObject: any) {
        let output: { [propertyName: string]: IColumnInfo } = {};
        
        for (let i in exampleObject) {
            if (
                typeof exampleObject[i] == "function" ||
                i == "EditableFieldMetadata"
            ) {
                continue;
            }
            
            output[i] = {
                Name: i.toUpperCase (),
                DefaultWidth: 200
            }
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
    
    public SelectRow (appendToggle: boolean, row: number, rangeSelect: boolean = false) {
        
        if (this.SelectedRows.length > 0) {
            this.Rows[this.SelectedRows[this.SelectedRows.length - 1]][0].forEach (cell => {
                cell.classList.remove ("last");
            });
        }
        
        if (rangeSelect) {
            if (this.SelectedRows.length == 0) {
                return;
            }
            
            let lastSelectedID = this.SelectedRows[this.SelectedRows.length - 1];
            
            for (let i = lastSelectedID; ; i += (row > lastSelectedID ? 1 : -1)) {
                if (!this.Rows[i]) {
                    continue;
                }
                
                if (this.SelectedRows.some (x => x == i)) {
                    
                } else {
                    this.SelectedRows.push (i);
                    this.Rows[i][0].forEach (cell => {
                        cell.classList.add ("selected");
                    });
                }
                
                if (i == row) { //Include the last one
                    break;
                }
            }
        } else if (appendToggle) {
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
        
        if (this.SelectedRows.length > 0) {
            this.Rows[this.SelectedRows[this.SelectedRows.length - 1]][0].forEach (cell => {
                cell.classList.add ("last");
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
        
        this.TableElement.remove ();
        this.TableElement = document.createElement ("div");
        this.TableElement.classList.add ("content-table");
        this.TableContainer.appendChild (this.TableElement);
        
        this.Columns = {};
        
        let headerContainer = document.createElement ("div");
        headerContainer.classList.add ("content-header-container");
        this.TableElement.appendChild (headerContainer);
        
        this.TableElement.addEventListener ("scroll", (e) => {
            headerContainer.style.left = `-${this.TableElement.scrollLeft}px`;
        });
        
        for (let columnID in this.ColumnsDefinitions) {
            let column = document.createElement ("div");
            column.classList.add ("content-column");
            column.style.width = `${this.ColumnsDefinitions[columnID].DefaultWidth}px`;
            this.Columns[columnID] = column;
            
            let columnHeader = document.createElement ("div");
            columnHeader.classList.add ("content-header");
            columnHeader.style.width = `${this.ColumnsDefinitions[columnID].DefaultWidth}px`;
            columnHeader.innerHTML = this.ColumnsDefinitions[columnID].Name;
            columnHeader.title = this.ColumnsDefinitions[columnID].Name;
            headerContainer.appendChild (columnHeader);
            
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
                    columnHeader.style.width = `${newWidth}px`;
                }, 10);
            }
            columnHeader.appendChild (columnResizer);
            
            this.TableElement.appendChild (column);
        }
        
        for (let i of ItemsBackup) {
            this.AddItem (i);
        }
    }
    
}