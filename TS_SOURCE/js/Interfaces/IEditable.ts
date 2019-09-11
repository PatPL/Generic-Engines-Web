interface IEditable<T> {
    
    GetDisplayElement?: () => HTMLElement;
    GetEditElement?: () => HTMLElement;
    
    ApplyValueToDisplayElement?: (displayElement: HTMLElement, valueHolder: T) => void;
    ApplyValueToEditElement?: (editElement: HTMLElement, valueHolder: T) => void;
    
    ApplyChangesToValue?: (editElement: HTMLElement, valueHolder: T) => void;
    
}