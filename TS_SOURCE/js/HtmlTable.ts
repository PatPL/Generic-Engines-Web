class HtmlTable<T extends ITableElement<T>> {
    
    // Fires when the contents of the table were changed
    OnChange?: () => void;
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
            cellField.OnValueChange = () => {
                // Resort the list only if the change was made in the currently sorted column,
                // or in a column that influences how this column gets sorted
                if (this.currentSort) {
                    if (this.currentSort[0] == columnID) {
                        this.SortItems ();
                    }
                    
                    let sortDependencies = newItem.ColumnSortDependencies ();
                    if (sortDependencies[this.currentSort[0]]) {
                        sortDependencies[this.currentSort[0]].forEach (d => {
                            // Sort if this column is a dependency to the current sort
                            if (d == columnID) {
                                this.SortItems ();
                            }
                        });
                    }
                }
                
                if (this.OnChange) { this.OnChange () };
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
            if (newItem.length > 0) {
                newItem.forEach (item => {
                    this.RawAddItem (item);
                });
                
                // Resort the items if any sort is currently enabled
                if (this.currentSort) { this.SortItems (); }
                if (this.OnChange) { this.OnChange (); }
            }
        } else {
            this.RawAddItem (newItem);
            
            // Resort the items if any sort is currently enabled
            if (this.currentSort) { this.SortItems (); }
            if (this.OnChange) { this.OnChange (); }
        }
    }
    
    public RemoveSelectedItems () {
        if (this.SelectedRows.length > 0) {
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
            if (this.OnChange) { this.OnChange (); }
        }
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
            console.warn (this);
            console.warn ("No columns were set.");
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
    
    private static readonly LOG_SORTING_PERFORMANCE: boolean = false;
    private SortItems () {
        this.DisplayedRowOrder.length = 0;
        
        if (this.currentSort && this.Items.length > 0) {
            let hadErrors = false;
            let sorts = this.Items[0].ColumnSorts ();
            if ((sorts as Object).hasOwnProperty (this.currentSort[0])) {
                let startTime: number = 0;
                let lapTime: number = 0;
                if (HtmlTable.LOG_SORTING_PERFORMANCE) {
                    console.warn ("Sort performance logging enabled");
                    console.log (`Sorting action: Sort by ${ this.currentSort[0] }`);
                    startTime = new Date ().getTime ();
                    lapTime = startTime;
                }
                
                let sortFunction = sorts[this.currentSort[0]];
                // First, remap HTMLElements and Items to sort them
                // RowID, Cells, Item, original order
                let originalMap: [string, HTMLElement[], T, number][] = [];
                let map: [string, HTMLElement[], T, number][] = [];
                for (let i in this.Rows) {
                    let order = 0;
                    let marker = this.Rows[i][0][0].previousSibling;
                    while (marker) {
                        ++order;
                        marker = marker.previousSibling;
                    }
                    
                    map.push ([i, this.Rows[i][0], this.Rows[i][1], order]);
                }
                
                // Copy the map, while remapping the objects to the order in the DOM
                map.forEach (e => { originalMap[e[3]] = e });
                
                if (HtmlTable.LOG_SORTING_PERFORMANCE) {
                    let now = new Date ().getTime ();
                    console.log (`Sorting action: Items mapped in ${ now - lapTime }ms`);
                    lapTime = now;
                }
                
                // Sort items according to the selected sort function
                map.sort ((a, b) => {
                    try {
                        return sortFunction (a[2], b[2]) * this.currentSort![1];
                    } catch (e) {
                        hadErrors = true;
                        return -1 * this.currentSort![1];
                    }
                });
                
                if (HtmlTable.LOG_SORTING_PERFORMANCE) {
                    let now = new Date ().getTime ();
                    console.log (`Sorting action: Items sorted in ${ now - lapTime }ms`);
                    lapTime = now;
                }
                
                // Works, but doesn't save that many DOM operations overall.
                // (Or my algorithm is bad, which is more likely IMO)
                // Not that there's much to save, ID fallback causes everything to fly around
                // Also, reversing the list is just as slow as it was before, as every element
                // needs to be moved
                // 
                // // Calculate the necessary swaps
                // let DOMSwaps: number[] = [];
                // let lastIndex = map.length - 1;
                // let lastCorrectIndex = lastIndex;
                // for (let i = map.length - 2; i >= 0; --i) {
                //     let thisIndex = map.findIndex (x => x[3] == originalMap[i][3]);
                //     if (thisIndex >= lastCorrectIndex) {
                //         continue;
                //     }
                    
                //     if (thisIndex != lastIndex - 1) {
                //         for (let i = lastCorrectIndex; i > thisIndex; --i) {
                //             DOMSwaps.push (i);
                //         }
                //     } else {
                        
                //     }
                    
                //     lastIndex = thisIndex;
                //     lastCorrectIndex = thisIndex;
                // }
                // DOMSwaps.push (0); // Doesn't work without it and I don't really want to try and figure out why
                // console.log (`Saved ${ map.length - DOMSwaps.length } DOM operations (Performed ${ Math.floor (1000000 * DOMSwaps.length / map.length) / 10000 }% work of original one)`);
                
                // // Apply the swaps
                // DOMSwaps.forEach (i => {
                //     map[i][1].forEach ((cell, cellIndex) => {
                //         cell.parentElement!.insertBefore (cell, map.length == i + 1 ? null : map[i + 1][1][cellIndex]);
                //     });
                // });
                
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
                
                if (HtmlTable.LOG_SORTING_PERFORMANCE) {
                    let now = new Date ().getTime ();
                    console.log (`Sorting action: DOM Manipulation finished in ${ now - lapTime }ms`);
                    console.log (`Sorting action finished in ${ now - startTime }ms`);
                }
                
                // Special case to report errors in engine lists
                if (hadErrors && this.Items[0] instanceof Engine) {
                    // Notifiers spawns messages bottom to top, so this message is flipped
                    Notifier.Warn ("Most likely caused by incorrect polymorphism. (Check disabled engines too)", 5000);
                    Notifier.Warn ("There are some validation errors in this list, that prevent correct sorting", 5000);
                }
                
                return; // Don't fall-through to regular item order
            } else {
                // This column has no sort function, revert to regular item order (Fall-through)
            }
        } else {
            // Disable sort, revert to regular item order (Fall-through)
        }
        
        let startTime: number = 0;
        if (HtmlTable.LOG_SORTING_PERFORMANCE) {
            console.warn ("Sort performance logging enabled");
            console.log ("Sorting action: Reset item order");
            startTime = new Date ().getTime ();
        }
        
        // Regular item order
        for (let i in this.Rows) {
            this.DisplayedRowOrder.push (i);
            this.Rows[i][0].forEach (cell => {
                cell.parentNode!.appendChild (cell);
                cell.style.display = "block";
            });
        }
        
        if (HtmlTable.LOG_SORTING_PERFORMANCE) {
            let now = new Date ().getTime ();
            console.log (`Sorting action: DOM Manipulation finished in ${ now - startTime }ms`);
            console.log (`Sorting action finished in ${ now - startTime }ms`);
        }
    }
}