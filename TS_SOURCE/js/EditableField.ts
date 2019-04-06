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
        
        //Autoselect number in fields with numbers
        if (/^[0-9]/.test ((this.EditElement as HTMLInputElement).value)) {
            let length = /^[0-9,.]+/.exec ((this.EditElement as HTMLInputElement).value)!;
            (this.EditElement as HTMLInputElement).focus ();
            (this.EditElement as HTMLInputElement).selectionStart = 0;
            (this.EditElement as HTMLInputElement).selectionEnd = length[0].length;
        }
        
        
        if (this.EditElement.parentElement!.getAttribute ("data-tablerow")) {
            document.getElementById ("edit-cell-height-override")!.innerHTML = `
                .selected {
                    height: ${this.EditElement.offsetHeight + 1}px;
                }
            `;
        }
    }
    
    public EndEdit (saveChanges: boolean = true) {
        if (EditableField.EditedField && EditableField.EditedField.FieldID != this.FieldID) {
            console.warn ("Tried to end edit of not edited field. Maybe throw?");
        }
        
        document.getElementById ("edit-cell-height-override")!.innerHTML = "";
        
        if (saveChanges) {
            this.ApplyChangesToValue ();
            this.ApplyValueToDisplayElement ();
        }
        
        if (this.ValueOwner.hasOwnProperty ("OnEditEnd")) {
            this.ValueOwner.OnEditEnd ();
        }
        
        EditableField.EditedField = null;
        
        this.ShowEditMode (false);
    }
    
    public SetValue (newValue: any) {
        this.ValueOwner[this.ValueName] = newValue;
        this.ApplyValueToDisplayElement ();
    }
    
    public RefreshDisplayElement () {
        this.ApplyValueToDisplayElement ();
    }
    
    private GetDisplayElement (): HTMLElement {
        if (
            !(
                this.ValueOwner && (
                    this.ValueOwner.hasOwnProperty (this.ValueName) || (
                        this.ValueOwner.hasOwnProperty ("EditableFieldMetadata") &&
                        this.ValueOwner.EditableFieldMetadata.hasOwnProperty (this.ValueName)
                    )
                )
            )
        ) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
        }
        
        let output: HTMLElement;
        if (typeof this.ValueOwner[this.ValueName] == "object" && "GetDisplayElement" in this.ValueOwner[this.ValueName]) {
            output = this.ValueOwner[this.ValueName].GetDisplayElement ();
        } else if (
            this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "GetDisplayElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]
        ) {
            output = this.ValueOwner.EditableFieldMetadata[this.ValueName].GetDisplayElement ();
        } else if (typeof this.ValueOwner[this.ValueName] == "string") {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            let tmp = document.createElement ("input");
            tmp.classList.add ("content-cell-content");
            tmp.type = "checkbox";
            
            tmp.addEventListener ("change", (e) => {
                this.ValueOwner[this.ValueName] = tmp.checked;
            })
            
            output = tmp;
        } else {
            //console.warn (this.ValueOwner[this.ValueName]);
            //console.warn (`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        }
        
        if (typeof this.ValueOwner[this.ValueName] != "boolean") {
            output.addEventListener ("dblclick", (e) => {
                if (!(e.srcElement! as Element).parentElement!.classList.contains ("hideCell")) {
                    this.StartEdit ();
                }
            });
        }
        
        return output;
    }
    
    private GetEditElement (): HTMLElement {
        if (
            !(
                this.ValueOwner && (
                    this.ValueOwner.hasOwnProperty (this.ValueName) || (
                        this.ValueOwner.hasOwnProperty ("EditableFieldMetadata") &&
                        this.ValueOwner.EditableFieldMetadata.hasOwnProperty (this.ValueName)
                    )
                )
            )
        ) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
        }
        
        let output: HTMLElement;
        if (typeof this.ValueOwner[this.ValueName] == "object" && "GetEditElement" in this.ValueOwner[this.ValueName]) {
            output = this.ValueOwner[this.ValueName].GetEditElement ();
        } else if (
            this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "GetEditElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]
        ) {
            output = this.ValueOwner.EditableFieldMetadata[this.ValueName].GetEditElement ();
        } else if (typeof this.ValueOwner[this.ValueName] == "string") {
            let tmp = document.createElement ("input");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            let tmp = document.createElement ("input");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        } else {
            //console.warn (this.ValueOwner[this.ValueName]);
            //console.warn (`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            output = tmp;
        }
        
        return output;
    }
    
    private ApplyValueToDisplayElement (): void {
        if (
            !(
                this.ValueOwner && (
                    this.ValueOwner.hasOwnProperty (this.ValueName) || (
                        this.ValueOwner.hasOwnProperty ("EditableFieldMetadata") &&
                        this.ValueOwner.EditableFieldMetadata.hasOwnProperty (this.ValueName)
                    )
                )
            )
        ) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
        }
        
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToDisplayElement (this.DisplayElement);
        } else if (
            this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyValueToDisplayElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]
        ) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyValueToDisplayElement (this.DisplayElement);
        } else if (typeof this.ValueOwner[this.ValueName] == "string") {
            this.DisplayElement.innerHTML = this.ValueOwner[this.ValueName];
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            this.DisplayElement.innerHTML = this.ValueOwner[this.ValueName].toString ();
        } else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            (<HTMLInputElement> this.DisplayElement).checked = this.ValueOwner[this.ValueName];
        } else {
            console.warn (this.ValueOwner[this.ValueName]);
            console.warn (`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
        }
    }
    
    private ApplyValueToEditElement (): void {
        if (
            !(
                this.ValueOwner && (
                    this.ValueOwner.hasOwnProperty (this.ValueName) || (
                        this.ValueOwner.hasOwnProperty ("EditableFieldMetadata") &&
                        this.ValueOwner.EditableFieldMetadata.hasOwnProperty (this.ValueName)
                    )
                )
            )
        ) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
        }
        
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToEditElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyValueToEditElement (this.EditElement);
        } else if (
            this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyValueToEditElement" in this.ValueOwner.EditableFieldMetadata[this.ValueName]
        ) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyValueToEditElement (this.EditElement);
        } else if (typeof this.ValueOwner[this.ValueName] == "string") {
            (<HTMLInputElement> this.EditElement).value = this.ValueOwner[this.ValueName];
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            (<HTMLInputElement> this.EditElement).value = this.ValueOwner[this.ValueName].toString ();
        } else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            this.EditElement.innerHTML = "This shouldn't be visible";
        } else {
            console.warn (this.ValueOwner[this.ValueName]);
            console.warn (`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
        }
    }
    
    private ApplyChangesToValue (): void {
        if (
            !(
                this.ValueOwner && (
                    this.ValueOwner.hasOwnProperty (this.ValueName) || (
                        this.ValueOwner.hasOwnProperty ("EditableFieldMetadata") &&
                        this.ValueOwner.EditableFieldMetadata.hasOwnProperty (this.ValueName)
                    )
                )
            )
        ) {
            throw `${this.ValueOwner} or ${this.ValueOwner}.${this.ValueName} is not set up as EditableField`;
        }
        
        if (typeof this.ValueOwner[this.ValueName] == "object" && "ApplyValueToDisplayElement" in this.ValueOwner[this.ValueName]) {
            this.ValueOwner[this.ValueName].ApplyChangesToValue (this.EditElement);
        } else if (
            this.ValueOwner.EditableFieldMetadata &&
            this.ValueOwner.EditableFieldMetadata[this.ValueName] &&
            "ApplyChangesToValue" in this.ValueOwner.EditableFieldMetadata[this.ValueName]
        ) {
            this.ValueOwner.EditableFieldMetadata[this.ValueName].ApplyChangesToValue (this.EditElement);
        } else if (typeof this.ValueOwner[this.ValueName] == "string") {
            this.ValueOwner[this.ValueName] = (<HTMLInputElement> this.EditElement).value;
        } else if (typeof this.ValueOwner[this.ValueName] == "number") {
            this.ValueOwner[this.ValueName] = parseFloat ((<HTMLInputElement> this.EditElement).value.replace (",", "."));
        } else if (typeof this.ValueOwner[this.ValueName] == "boolean") {
            console.warn ("Boolean doesn't use edit mode, this shouldn't be called");
        } else {
            console.warn (this.ValueOwner[this.ValueName]);
            console.warn (`${this.ValueOwner[this.ValueName]} doesn't implement IEditable`);
        }
    }
    
}

window.addEventListener ("pointerdown", (e) => {
    if (EditableField.EditedField) {
        //Check whether pointer was over current field
        if (e.srcElement) {
            let currentElement: Element | null = e.srcElement as Element;
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