namespace EngineEditableFieldMetadata {
    export const Spacer: IEditable<Engine> = {
        GetDisplayElement: () => {
            let tmp = document.createElement ("div");
            tmp.classList.add ("content-cell-content");
            return tmp;
        }
    };
}