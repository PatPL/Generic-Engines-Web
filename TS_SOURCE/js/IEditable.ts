interface IEditable {
    
    GetDisplayElement: () => HTMLElement;
    GetEditElement: () => HTMLElement;
    
    ApplyValueToDisplayElement: (displayElement: HTMLElement) => void;
    ApplyValueToEditElement: (editElement: HTMLElement) => void;
    
    ApplyChangesToValue: (editElement: HTMLElement) => void;
    
}