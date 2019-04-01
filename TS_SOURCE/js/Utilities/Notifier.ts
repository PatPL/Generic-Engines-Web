addEventListener ("DOMContentLoaded", () => {
    Notifier.Container = document.querySelector<HTMLElement> (".notify-container")!;
});

class Notifier {
    
    public static readonly NotificationLifetime = 7500;
    public static Container: HTMLElement;
    
    public static Info (text: string, lifetime: number = this.NotificationLifetime) {
        let box = document.createElement ("div");
        box.classList.add ("notify-box");
        box.classList.add ("info");
        
        box.innerHTML = text;
        Notifier.Container.appendChild (box);
        
        box.addEventListener ("click", () => {
            box.remove ();
        })
        
        if (lifetime > 0) {
            setTimeout (() => {
                box.remove ();
            }, lifetime);
        }
    }
    
    public static Warn (text: string, lifetime: number = this.NotificationLifetime) {
        let box = document.createElement ("div");
        box.classList.add ("notify-box");
        box.classList.add ("warn");
        
        box.innerHTML = text;
        Notifier.Container.appendChild (box);
        
        box.addEventListener ("click", () => {
            box.remove ();
        })
        
        if (lifetime > 0) {
            setTimeout (() => {
                box.remove ();
            }, lifetime);
        }
    }
    
    public static Error (text: string, lifetime: number = this.NotificationLifetime) {
        let box = document.createElement ("div");
        box.classList.add ("notify-box");
        box.classList.add ("error");
        
        box.innerHTML = text;
        Notifier.Container.appendChild (box);
        
        box.addEventListener ("click", () => {
            box.remove ();
        })
        
        if (lifetime > 0) {
            setTimeout (() => {
                box.remove ();
            }, lifetime);
        }
    }
    
}