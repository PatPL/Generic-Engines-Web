class Cookie {
    
    public static Set (id: string, value: string) {
        document.cookie = `${id}=${value}; expires=Tue, 19 Jan 2038 03:14:07 UTC`;
    }
    
    public static GetAll (): { [id: string]: string } {
        let cookies: { [id: string]: string } = {};
        
        let lines = document.cookie.split ("; ");
        
        lines.forEach (l => {
            let tmp = l.split ("=", 2);
            let id = tmp[0];
            let value = tmp[1];
            cookies
        });
        
        return cookies;
    }
    
    public static Get (id: string): string {
        return Cookie.GetAll ()[id];
    }
    
    public static Remove (id: string) {
        document.cookie = `${id}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    }
    
}