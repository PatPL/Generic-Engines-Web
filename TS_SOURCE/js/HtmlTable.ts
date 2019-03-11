class HtmlTable {
    
    Items: any[] = [];
    Columns: { [propertyName: string]: string } = {};
    
    TableContainer: HTMLElement;
    
    constructor (container: HTMLElement) {
        this.TableContainer = container;
    }
    
    public static AutoGenerateColumns (exampleObject: any) {
        let output: { [propertyName: string]: string } = {};
        
        for (let i in exampleObject) {
            output[i] = i.toUpperCase ();
        }
        
        return output;
    }
    
    public RebuildTable () {
        
        if (Object.getOwnPropertyNames (this.Columns).length == 0) {
            console.log (this);
            console.log ("No columns were set.");
            return
        }
        
        let tableElement: HTMLElement = document.createElement ("div");
        tableElement.classList.add ("content-table");
        
        for (let columnID in this.Columns) {
            let column = document.createElement ("div");
            column.classList.add ("content-column");
            
            let columnHeader = document.createElement ("div");
            columnHeader.classList.add ("content-header");
            columnHeader.innerHTML = this.Columns[columnID];
            column.appendChild (columnHeader);
            
            this.Items.forEach (item => {
                let columnCell = document.createElement ("div");
                columnCell.classList.add ("content-cell");
                columnCell.innerHTML = item[columnID];
                column.appendChild (columnCell);
            });
            
            tableElement.appendChild (column);
        }
        
        this.TableContainer.innerHTML = "";
        this.TableContainer.appendChild (tableElement);
    }
    
}