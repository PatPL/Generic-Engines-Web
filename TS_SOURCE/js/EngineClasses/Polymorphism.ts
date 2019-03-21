///<reference path="../Enums/PolymorphismType.ts" />
class Polymorphism implements IEditable {
    
    PolyType: PolymorphismType = PolymorphismType.Single;
    MasterEngineName: string = "";
    //MasterEngineCost: number = 0; //Sync issues ahead? Try to fetch these values during exporting. ID should be enough
    //MasterEngineMass: number = 0;
    
    EngineList: Engine[];
    
    constructor (originList: Engine[]) {
        this.EngineList = originList;
    }
    
    private RebuildMasterSelect (e: HTMLElement) {
        let selects = e.querySelectorAll ("select");
        selects[1].innerHTML = "";
        let option1: HTMLOptionElement = document.createElement ("option");
        
        option1.value = "";
        option1.text = "";
        option1.selected = "" == this.MasterEngineName;
        selects[1].options.add (option1.cloneNode (true) as HTMLOptionElement);
        
        if (parseInt (selects[0].value) == PolymorphismType.MultiModeSlave) {
            this.EngineList.filter (x => x.Active && x.Polymorphism.PolyType == PolymorphismType.MultiModeMaster).forEach (e => {
                let option: HTMLOptionElement = document.createElement ("option");
                option.value = `${e.ID}`;
                option.text = e.ID;
                option.selected = e.ID == this.MasterEngineName;
                selects[1].options.add (option);
            });
        } else if (parseInt (selects[0].value) == PolymorphismType.MultiConfigSlave) {
            this.EngineList.filter (x => x.Active && x.Polymorphism.PolyType == PolymorphismType.MultiConfigMaster).forEach (e => {
                let option: HTMLOptionElement = document.createElement ("option");
                option.value = `${e.ID}`;
                option.text = e.ID;
                option.selected = e.ID == this.MasterEngineName;
                selects[1].options.add (option);
            });
        } else {
            
        }
        
    }
    
    public GetDisplayElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        return tmp;
    }
    
    public ApplyValueToDisplayElement (e: HTMLElement): void {
        switch (this.PolyType) {
            case PolymorphismType.Single:
            e.innerHTML = `Single`;
            break; case PolymorphismType.MultiModeMaster:
            e.innerHTML = `Multimode master`;
            break; case PolymorphismType.MultiModeSlave:
            e.innerHTML = `Multimode slave to ${this.MasterEngineName}`;
            break; case PolymorphismType.MultiConfigMaster:
            e.innerHTML = `Multiconfig master`;
            break; case PolymorphismType.MultiConfigSlave:
            e.innerHTML = `Multiconfig slave to ${this.MasterEngineName}`;
            break;
        }
    }
    
    public GetEditElement (): HTMLElement {
        let tmp = document.createElement ("div");
        tmp.classList.add ("content-cell-content");
        tmp.style.height = "48px";
        tmp.style.padding = "0";
        
        let grid = document.createElement ("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "auto";
        grid.style.gridTemplateRows = "24px 24px";
        grid.style.gridTemplateAreas = `
            "a"
            "b"
        `;
        
        grid.innerHTML = `
            <div style="grid-area: a;">${Polymorphism.Dropdown.outerHTML}</div>
            <div style="grid-area: b;"><select></select></div>
        `;
        
        let selects = grid.querySelectorAll ("select");
        selects[0].addEventListener ("change", () => {
            this.RebuildMasterSelect (tmp);
        });
        
        tmp.appendChild (grid);
        
        return tmp;
    }
    
    public ApplyValueToEditElement (e: HTMLElement): void {
        let selects = e.querySelectorAll ("select");
        
        selects[0].value = this.PolyType.toString ();
        this.RebuildMasterSelect (e);
    }
    
    public ApplyChangesToValue (e: HTMLElement): void {
        let selects = e.querySelectorAll ("select");
        
        this.PolyType = parseInt (selects[0].value);
        this.MasterEngineName = selects[1].value;
    }
    
    public static readonly Dropdown: HTMLSelectElement = Polymorphism.BuildPolymorphismTypeDropdown ();
    private static BuildPolymorphismTypeDropdown (): HTMLSelectElement {
        let output = document.createElement ("select");
        let option = document.createElement ("option");
        
        option.value = PolymorphismType.Single.toString ();
        option.text = "Single";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        option.value = PolymorphismType.MultiModeMaster.toString ();
        option.text = "Multimode master";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        option.value = PolymorphismType.MultiModeSlave.toString ();
        option.text = "Multimode slave";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        option.value = PolymorphismType.MultiConfigMaster.toString ();
        option.text = "Multiconfig master";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        option.value = PolymorphismType.MultiConfigSlave.toString ();
        option.text = "Multiconfig slave";
        output.options.add (option.cloneNode (true) as HTMLOptionElement);
        
        return output;
    }
    
}