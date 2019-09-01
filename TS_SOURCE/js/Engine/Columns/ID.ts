namespace EngineEditableFieldMetadata {
    export const ID: IEditable<Engine> = {
        ApplyChangesToValue: (e, engine) => {
            let output = "";
            let rawInput = (e as HTMLInputElement).value;
            
            rawInput.replace (" ", "-");
            
            for (let i = 0; i < rawInput.length; ++i) {
                if (/[a-zA-Z0-9-]{1}/.test (rawInput[i])) {
                    output += rawInput[i];
                }
            }
            
            if (output == "") {
                output = "EnterCorrectID";
            }
            
            engine.ID = output;
        }
    };
}