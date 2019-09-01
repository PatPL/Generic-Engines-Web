namespace EngineEditableFieldMetadata {
    export const EngineVariant: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = EngineType[engine.EngineVariant];
        }, GetEditElement: () => {
            let tmp = document.createElement ("select");
            tmp.classList.add ("content-cell-content");
            for (let i in EngineType) {
                let x = parseInt (i);
                if (isNaN (x)) {
                    break;
                }
                let option = document.createElement ("option");
                option.value = x.toString ();
                option.text = EngineType[x];
                tmp.options.add (option);
            }
            return tmp;
        }
    };
}