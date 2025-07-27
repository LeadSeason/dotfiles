- [x] battery lable, show remanin battery. Hours and minutes.  
- [ ] Show how long it lasts.  
- [x] Caching module to quicly save items so they can be later refered to  
    Needs to be tested.  
- [x] Scss cleanup, split the file up to multiple files  
- [x] PowerManagement  
- [x] Media and how it show should be cleaned up.  
- [ ] Tooltips  
    [ ] Network widget, Show ipv4, ipv6 upstreams and both gateways.  

### V3 Rewrite
 - [ ] Handle Sway Toggle gaps
     - [ ] Also switch off shadows

 - [ ] Show logged in users,
    - If over than 1 then show a widget.

 - [ ] VPN module show if vpn enabled.
     - [ ] For example wireguard, openvpn or openfortivpn

 - [x] Bar  
     - [x] Scss
     - [x] Cock 
        - Good enough for now
     - [ ] Powermenu drop down
        - Idk will I make it. Perhaps

 - [x] Scratchpad
      - [ ] Fix cases where con has children and con.name is null.
 - [ ] OSD
 - [ ] Media
 - [ ] Powermenu
 - [ ] Super Super launcher Menu Menu
     - [ ] Launcher
     - [ ] Open scratchpad items
        - Scratchpad Item have higher priority.
     - [ ] Change focus to other applications
        - idk maybe not a good Idea if I want to for example open a duplicate app,
        Or make it work with a prefix like ,.!"#%
     - [ ] Do maths
        - 1 + 1
        - 12 ** 2
        - Perhaps with prefix or just check if its a valid calculation
        - Enter Copies the results to the clipboard 
     - [ ] Currency conversation
        - USD to EURO
        - BTC to Money
        - Example: 1230usd to euro, .69 btc to yen
        - Perhaps with prefix or just check if its a valid conversation
        - Enter Copies the results to the clipboard 
        - https://api.exchangerate-api.com/v4/latest/USD
        - https://www.geeksforgeeks.org/javascript/currency-converter-in-javascript/
     - [ ] Time conversation. 
        - 159071min to days = "159071min to days = 110 d + 11 h + 11min"
        - Prefix or valid conversation
     - [ ] Download options
         - [ ] Yt download.
            - Pasting a link in will prompt for download
            - Downloads are downloaded in to the xdg download dir
            - Show a notification for download (Does'nt have to be real time download progress)
            - Copy item to clipboard.
            - Use something like `wl-copy -t text/uri-list "file://$(realpath The\ Pharaoh\'s\ Curse\ and\ more\ \[9d6wNsgt99k\].mp4)"`
            - Show notification actions for Open file, Open directory, copy file
            - With prefix or if a valid link is in the search.
            - Show options for if you want to download video or audio only
     - [ ] Prefix completion prefix
        - #math
        - #convert
        - #time 
        - #dlp
        - #wallpaper 
            - with preview.
        # Power items
        - #lock
        - #logout
        - #sleep / #hibernate
        - #reboot
        - #shutdown


[x] Scratchpad
    [x] Icons
