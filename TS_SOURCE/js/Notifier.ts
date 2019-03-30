addEventListener ("DOMContentLoaded", () => {
    Notifier.Container = document.querySelector<HTMLElement> (".notify-container")!;
});

class Notifier {
    
    public static readonly NotificationLifetime = 7500;
    public static Container: HTMLElement;
    
    public static Info (text: string) {
        let box = document.createElement ("div");
        box.classList.add ("notify-box");
        box.classList.add ("info");
        
        box.innerHTML = text;
        Notifier.Container.appendChild (box);
        
        box.addEventListener ("click", () => {
            box.remove ();
        })
        
        setTimeout (() => {
            box.remove ();
        }, this.NotificationLifetime);
    }
    
    public static Warn (text: string) {
        let box = document.createElement ("div");
        box.classList.add ("notify-box");
        box.classList.add ("warn");
        
        box.innerHTML = text;
        Notifier.Container.appendChild (box);
        
        box.addEventListener ("click", () => {
            box.remove ();
        })
        
        setTimeout (() => {
            box.remove ();
        }, this.NotificationLifetime);
    }
    
    public static Error (text: string) {
        let box = document.createElement ("div");
        box.classList.add ("notify-box");
        box.classList.add ("error");
        
        box.innerHTML = text;
        Notifier.Container.appendChild (box);
        
        box.addEventListener ("click", () => {
            box.remove ();
        })
        
        setTimeout (() => {
            box.remove ();
        }, this.NotificationLifetime);
    }
    
}