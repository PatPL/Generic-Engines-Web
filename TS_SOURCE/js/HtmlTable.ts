class HtmlTable<T extends ITableElement<T>> {
    
    OnSelectedItemChange?: (selected?: T) => void;
    
    Items: T[] = [];
    ColumnsDefinitions: { [propertyName: string]: IColumnInfo } = {};
    
    ColumnHeaders: { [columnID: string]: HTMLElement } = {};
    Columns: { [columnID: string]: HTMLElement } = {};
    Rows: { [rowID: number]: [HTMLElement[], T] } = {};
    DisplayedRowOrder: string[] = [];
    
    static RowCounter: number = 1;
    SelectedRows: number[] = [];
    
    readonly TableContainer: HTMLElement;
    TableElement: HTMLElement;
    
    currentSort?: [string, number];
    
    constructor (container: HTMLElement) {
        this.TableContainer = container;
        
        this.TableElement = document.createElement ("div");
        this.TableElement.classList.add ("content-table");
        
        this.TableContainer.innerHTML = "";
        this.TableContainer.appendChild (this.TableElement);
        
        window.addEventListener ("pointerdown", (e) => {
            // Only listen for LMB presses
            if (e.which != 1) { return; }
            
            if (e.srcElement) {
                let currentElement: Element | null = e.srcElement as Element;
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
    
    private RawAddItem (newItem: T) {
        this.Items.push (newItem);
        this.Rows[HtmlTable.RowCounter] = [Array<HTMLElement> (Object.getOwnPropertyNames (this.ColumnsDefinitions).length), newItem];
        let x = 0;
        for (let columnID in this.ColumnsDefinitions) {
            let columnCell = document.createElement ("div");
            columnCell.classList.add ("content-cell");
            columnCell.setAttribute ("data-tableRow", (HtmlTable.RowCounter).toString ());
            let cellField = new EditableField (newItem, columnID, columnCell);
            cellField.OnSaveEdit = () => {
                this.SortItems ();
            }
            
            if ((newItem as Object).hasOwnProperty ("EditableFields")) {
                newItem.EditableFields.push (cellField);
            }
            
            this.Rows[HtmlTable.RowCounter][0][x] = columnCell;
            
            this.Columns[columnID].appendChild (columnCell);
            ++x;
        }
        
        if (newItem.OnTableDraw && typeof newItem.OnTableDraw == "function") {
            newItem.OnTableDraw (this.Rows[HtmlTable.RowCounter][0]);
        }
        
        this.DisplayedRowOrder.push (HtmlTable.RowCounter.toString ());
        ++HtmlTable.RowCounter;
    }
    
    public AddItems (newItem: T | T[]) {
        if (Array.isArray (newItem)) {
            newItem.forEach (item => {
                this.RawAddItem (item);
            })
        } else {
            this.RawAddItem (newItem);
        }
        
        // Resort the items if any sort is currently enabled
        if (this.currentSort) { this.SortItems (); }
    }
    
    public RemoveSelectedItems () {
        this.SelectedRows.forEach (row => {
            this.Rows[row][0].forEach (element => {
                element.remove ();
            });
            
            this.Items.splice (this.Items.indexOf (this.Rows[row][1]), 1);
            this.DisplayedRowOrder.splice (this.DisplayedRowOrder.findIndex (x => x == row.toString ()), 1);
            delete this.Rows[row];
        });
        
        this.SelectedRows = [];
        if (this.OnSelectedItemChange) {
            this.OnSelectedItemChange (undefined);
        }
        
        // Resort the items if any sort is currently enabled
        if (this.currentSort) { this.SortItems (); }
    }
    
    // appendToggle -> add to current selection (Ctrl key)
    // rangeSelect -> select all items from last selected item, to the selected item (Shift key)
    public SelectRow (appendToggle: boolean, row: number, rangeSelect: boolean = false) {
        
        // Remove the distinct last selected item highlight
        if (this.SelectedRows.length > 0) {
            this.Rows[this.SelectedRows[this.SelectedRows.length - 1]][0].forEach (cell => {
                cell.classList.remove ("last");
            });
        }
        
        if (rangeSelect) {
            if (this.SelectedRows.length == 0) {
                return;
            }
            
            // VisualIDs
            let lastSelectedID = this.DisplayedRowOrder.findIndex (x => x == this.SelectedRows[this.SelectedRows.length - 1].toString ());
            let currentSelectedID = this.DisplayedRowOrder.findIndex (x => x == row.toString ());
            
            for (let i = lastSelectedID; ; i += (currentSelectedID > lastSelectedID ? 1 : -1)) {
                let decodedI = parseInt (this.DisplayedRowOrder[i]);
                if (this.SelectedRows.some (x => x == decodedI)) {
                    
                } else {
                    this.SelectedRows.push (decodedI);
                    this.Rows[decodedI][0].forEach (cell => {
                        cell.classList.add ("selected");
                    });
                }
                
                if (decodedI == row) { //Include the last one (Break AFTER this one is already processed)
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
        
        // Reapply the distinct last selected item highlight
        if (this.SelectedRows.length > 0) {
            if (this.OnSelectedItemChange) {
                this.OnSelectedItemChange (this.Rows[this.SelectedRows[this.SelectedRows.length - 1]][1]);
            }
            
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
        
        let ItemsBackup: T[] = new Array<T> ().concat (this.Items);
        this.Items = [];
        
        this.SelectedRows = [];
        for (let i in this.Rows) {
            this.SelectedRows.push (parseInt (i));
        }
        
        this.RemoveSelectedItems ();
        this.currentSort = undefined;
        
        this.TableElement.remove ();
        this.TableElement = document.createElement ("div");
        this.TableElement.classList.add ("content-table");
        this.TableContainer.appendChild (this.TableElement);
        
        this.ColumnHeaders = {};
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
            
            columnHeader.addEventListener ("pointerdown", e => {
                // Only listen for LMB presses
                if (e.which != 1) { return; }
                
                this.Sort (columnID);
            });
            
            this.ColumnHeaders[columnID] = columnHeader;
            
            let columnResizer = document.createElement ("div");
            columnResizer.classList.add ("content-column-resizer");
            columnResizer.setAttribute ("data-FieldID", "-1");
            columnResizer.addEventListener ("pointerdown", e => {
                // Only listen for LMB presses
                if (e.which != 1) { return; }
                
                e.stopPropagation ();
                let originalX = Input.MouseX;
                let originalWidth = column.style.width ? parseInt (column.style.width) : 400;
                Dragger.Drag (() => {
                    let newWidth = originalWidth + Input.MouseX - originalX;
                    newWidth = Math.max (24, newWidth);
                    column.style.width = `${newWidth}px`;
                    columnHeader.style.width = `${newWidth}px`;
                });
            });
            columnHeader.appendChild (columnResizer);
            
            this.TableElement.appendChild (column);
        }
        
        this.AddItems (ItemsBackup);
    }
    
    // This just fiddles with visuals and handles 'this.currentSort' for sorting in another method
    private Sort (columnID?: string) {
        if (columnID) {
            // First, remove current sort, if it's on another column
            if (this.currentSort && this.currentSort[0] != columnID) {
                this.ColumnHeaders[this.currentSort[0]].classList.remove (this.currentSort[1] == 1 ? "sortAsc" : "sortDesc");
                this.currentSort = undefined;
            }
            
            // Sort is a three-way toggle - [Sort asc.|Sort desc.|none]
            if (this.currentSort) {
                // currentSort[0] is guarenteed to be the same as 'columnID' here
                if (this.currentSort[1] == 1) {
                    // It's currently ascending, switch to descending
                    this.currentSort[1] = -1;
                    this.ColumnHeaders[columnID].classList.remove ("sortAsc");
                    this.ColumnHeaders[columnID].classList.add ("sortDesc");
                } else {
                    // It's currently descending, disable sorting
                    this.currentSort = undefined;
                    this.ColumnHeaders[columnID].classList.remove ("sortDesc");
                }
            } else {
                // Nothing is currently selected, sort in ascending order
                this.currentSort = [columnID, 1];
                this.ColumnHeaders[columnID].classList.add ("sortAsc");
            }
        } else {
            // Disable sorting, return to the regular orders
            if (this.currentSort) {
                this.ColumnHeaders[this.currentSort[0]].classList.remove (this.currentSort[1] == 1 ? "sortAsc" : "sortDesc");
                this.currentSort = undefined;
            }
        }
        
        // Actually sort the items using currentSort
        this.SortItems ();
    }
    
    private SortItems () {
        // Call it according to the setting
        console.log (Settings.async_sort);
        if (Settings.async_sort) {
            setTimeout (() => this._SortItems (), 0);
        } else {
            this._SortItems ();
        }
    }
    
    private _SortItems () {
        this.DisplayedRowOrder.length = 0;
        
        if (this.currentSort && this.Items.length > 0) {
            let sorts = this.Items[0].ColumnSorts ();
            if ((sorts as Object).hasOwnProperty (this.currentSort[0])) {
                let sortFunction = sorts[this.currentSort[0]];
                // First, remap HTMLElements and Items to sort them
                let map: [string, HTMLElement[], T][] = [];
                for (let i in this.Rows) {
                    map.push ([i, this.Rows[i][0], this.Rows[i][1]]);
                }
                
                // Sort items according to the selected sort function
                map.sort ((a, b) => {
                    return sortFunction (a[2], b[2]) * this.currentSort![1];
                });
                
                // Apply the new item order
                map.forEach (row => {
                    let hideRow: boolean | null = null;
                    // Special case for hide-able Engine fields
                    if (Settings.hide_disabled_fields_on_sort && row[2] instanceof Engine) {
                        hideRow = (this.ColumnsDefinitions[this.currentSort![0]].DisplayFlags! & 1 << row[2].PolyType) != 0;
                    }
                    
                    this.DisplayedRowOrder.push (row[0]);
                    row[1].forEach (cell => {
                        if (hideRow != null) {
                            // Don't touch hidden ones to bump them to the top, and keep gray bgs' pattern correct
                            if (!hideRow) {
                                cell.parentNode!.appendChild (cell);
                            }
                            
                            cell.style.display = hideRow ? "none" : "block";
                        } else {
                            cell.parentNode!.appendChild (cell);
                        }
                    });
                });
                return; // Don't fall-through to regular item order
            } else {
                // This column has no sort function, revert to regular item order (Fall-through)
            }
        } else {
            // Disable sort, revert to regular item order (Fall-through)
        }
        
        // Regular item order
        for (let i in this.Rows) {
            this.DisplayedRowOrder.push (i);
            this.Rows[i][0].forEach (cell => {
                cell.parentNode!.appendChild (cell);
                cell.style.display = "block";
            });
        }
    }
}