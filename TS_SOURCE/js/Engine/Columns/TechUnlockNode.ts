namespace EngineEditableFieldMetadata {
    export const TechUnlockNode: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = TechNodeNames.get (engine.TechUnlockNode)!;
        }, GetEditElement: () => {
            let tmp = document.createElement ("input");
            tmp.classList.add ("content-cell-content");
            tmp.setAttribute ("list", "techNodeItems"); // tmp.list is readonly because reasons, apparently
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            (e as HTMLInputElement).value = TechNodeNames.get (engine.TechUnlockNode)!;
        }, ApplyChangesToValue: (e, engine) => {
            let value: number = 0;
            TechNodeNames.forEach ((name, node) => {
                if ((e as HTMLInputElement).value.trim () == name) {
                    value = node;
                }
            });
            
            engine.TechUnlockNode = value;
        }
    };
}