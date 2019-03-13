class EditableField {
    
    ValueOwner: { [id: string]: any };
    ValueName: string;
    Container: HTMLElement;
    
    DisplayElement: HTMLElement;
    EditElement: HTMLElement;
    
    FieldID: number;
    
    static EditedField: EditableField | null = null;
    static IDCounter: number = 0;
    
    constructor (valueOwner: { [id: string]: any }, valueName: string, container: HTMLElement) {
        this.FieldID = EditableField.IDCounter++;
        
        this.ValueOwner = valueOwner;
        this.ValueName = valueName;
        this.Container = container;
        
        this.Container.setAttribute ("data-FieldID", this.FieldID.toString ());
        
        this.DisplayElement = this.GetDisplayElement ();
        this.EditElement = this.GetEditElement ();
        
        this.ApplyValueToDisplayElement ();
        this.ShowEditMode (false);
        
        this.Container.appendChild (this.DisplayElement);
        this.Container.appendChild (this.EditElement);
    }
    
    private ShowEditMode (editMode: boolean) {
        if (editMode) {
            this.DisplayElement.style.display = "none";
            this.EditElement.style.display = "block";
        } else {
            this.DisplayElement.style.display = "block";
            this.EditElement.style.display = "none";
        }
    }
    
    public StartEdit () {
        if (EditableField.EditedField) {
            EditableField.EditedField.EndEdit ();
        }
        
        EditableField.EditedField = this;
        
        this.ApplyValueToEditElement ();
        
        this.ShowEditMode (true);
    }
    
    public EndEdit (saveChanges: boolean = true) {
        if (EditableField.EditedField && EditableField.EditedField.FieldID != this.FieldID) {
            console.warn ("Tried to end edit of not edited field. Maybe throw?");
        }
        
        if (saveChanges) {
            this.ApplyChangesToValue ();
            this.ApplyValueToDisplayElement ();
        }
        
        EditableField.EditedField = null;
        
        this.ShowEditMode (false);
    }
    
    private GetDisplayElement (): HTMLElement {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty (this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
        }
        
        let output: HTMLElement;
        if (typeof this.ValueOwner[this.ValueName] == "string") {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else if ("GetDisplayElement" in this.ValueOwner[this.ValueName]) {
            output = this.ValueOwner[this.ValueName].GetDisplayElement ();
        } else {
            throw `${this.ValueOwner[this.ValueName]} doesn't implement IEditable`;
        }
        
        output.addEventListener ("dblclick", () => {
            this.StartEdit ();
        });
        
        return output;
    }
    
    private GetEditElement (): HTMLElement {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty (this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
        }
        
        let output: HTMLElement;
        if (typeof this.ValueOwner[this.ValueName] == "string") {
            let tmp = document.createElement ("input");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            let tmp = document.createElement ("input");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else if ("GetEditElement" in this.ValueOwner[this.ValueName]) {
            output = this.ValueOwner[this.ValueName].GetEditElement ();
        } else {
            throw `${this.ValueOwner[this.ValueName]} doesn't implement IEditable`;
        }
        
        return output;
    }
    
    private ApplyValueToDisplayElement (): void {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty (this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
        }
        
        if (typeof this.ValueOwner[this.ValueName] == "string") {
            this.DisplayElement.innerHTML = this.ValueOwner[this.ValueName];
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            this.DisplayElement.innerHTML = this.ValueOwner[this.ValueName].toString ();
        } else if ("ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToDisplayElement ();
        } else {
            console.warn (this.ValueOwner[this.ValueName]);
            console.warn (`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
            throw `${this.ValueOwner[this.ValueName]} doesn't implement IEditable`;
        }
    }
    
    private ApplyValueToEditElement (): void {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty (this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
        }
        
        if (typeof this.ValueOwner[this.ValueName] == "string") {
            (<HTMLInputElement> this.EditElement).value = this.ValueOwner[this.ValueName];
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            (<HTMLInputElement> this.EditElement).value = this.ValueOwner[this.ValueName].toString ();
        } else if ("ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToEditElement ();
        } else {
            console.warn (this.ValueOwner[this.ValueName]);
            console.warn (`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
            throw `${this.ValueOwner[this.ValueName]} doesn't implement IEditable`;
        }
    }
    
    private ApplyChangesToValue (): void {
        if (!this.ValueOwner || !this.ValueOwner.hasOwnProperty (this.ValueName)) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is null/undefined`;
        }
        
        if (typeof this.ValueOwner[this.ValueName] == "string") {
            this.ValueOwner[this.ValueName] = (<HTMLInputElement> this.EditElement).value;
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            this.ValueOwner[this.ValueName] = parseFloat ((<HTMLInputElement> this.EditElement).value.replace (",", "."));
        } else if ("ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToEditElement ();
        } else {
            console.warn (this.ValueOwner[this.ValueName]);
            console.warn (`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
            throw `${this.ValueOwner[this.ValueName]} doesn't implement IEditable`;
        }
    }
    
}

window.addEventListener ("pointerup", (e) => {
    if (EditableField.EditedField) {
        //Check whether pointer was over current field
        if (e.srcElement) {
            let currentElement: Element | null = e.srcElement;
            let foundEdited = false;
            
            while (currentElement != null) {
                
                if (
                    currentElement.getAttribute ("data-FieldID") == EditableField.EditedField.FieldID.toString () ||
                    currentElement.getAttribute ("data-FieldID") == "-1"
                ) {
                    foundEdited = true;
                    break;
                }
                
                currentElement = currentElement.parentElement;
            }
            
            if (foundEdited) {
                //Pointer released over edited element, no change
            } else {
                //Pointer released somewhere else, exit edit mode
                EditableField.EditedField.EndEdit ();
            }
            
        }
    } else {
        //No field currently edited, no change
    }
});

window.addEventListener ("keyup", (e) => {
    if (EditableField.EditedField) {
        switch (e.key) {
            case "Escape":
            EditableField.EditedField.EndEdit (false);
            break;
            case "Enter":
            EditableField.EditedField.EndEdit ();
            break;
        }
    }
});