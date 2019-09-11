namespace EngineEditableFieldMetadata {
    export const MinThrust: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = `${engine.MinThrust}%`;
        }
    };
}