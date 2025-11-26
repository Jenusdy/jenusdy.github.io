---
title: "Setting Up OpenFortiVPN with SSO Login as an Alternative to FortiClient"
description: "How to set up OpenFortiVPN on Ubuntu with SSO login authentication as an alternative to FortiClient."
date: "2025-11-26"
banner:
  src: "../../images/articles/fortivpn-linux/thumbnail.png"
  alt: "Setting Up OpenFortiVPN"
categories:
  - "Tools"
  - "Random"
keywords:
  - "VPN"
  - "FortiVPN"
  - "Linux"
---

## Intro

As a Programmer, I switch between Linux Ubuntu and Windows. When I work at the office, I use Windows, but when I work from home, I use Ubuntu on my PC. Sometimes when working from home, I need to connect to a database, which requires me to connect to my office's internal VPN first. We use Fortinet VPN as our provider; however, the FortiClient installer for Ubuntu 24.04 doesn't exist yet. The latest version available on their download page still on Ubuntu 16.04. I attempted to forcefully install it on my Ubuntu 24.04, but encountered several issues, including connection getting stuck at 99%, frequent disconnections after less than a minute of connection, the client failing to open, and needing to add EMS Token, etc. 

## OpenFortiVPN

After researching, I found an open-source repository on GitHub called [OpenFortiVPN](https://github.com/adrienverge/openfortivpn). After installing it, I tried to connect using the following command but didn't work

```bash
jenusdy@ubuntu:~$ sudo openfortivpn akses.bps.go.id:443 --username {username}
VPN account password: 
INFO:   Connected to gateway.
ERROR:  Could not authenticate to gateway. Please check the password, client certificate, etc.
INFO:   Closed connection to gateway.
INFO:   Logged out.
```

If I am not mistaken, the VPN server at my office doesn't allow to connections using using username & password authentication. They only supports SSO page login. After reading the documentation, I tried adding the --saml-login parameter as shown below:

```bash
jenusdy@ubuntu:~$ sudo openfortivpn akses.bps.go.id:443 --username {username} --saml-login
INFO:   Listening for SAML login on port 8020
INFO:   Authenticate at 'https://akses.bps.go.id:443/remote/saml/start?redirect=1'
```
 
After I click the link, it displayed the SSO login page. I logged in with my SSO crendentials, and it returned me to my terminal where the connection worked.

```bash
jenusdy@ubuntu:~$ sudo openfortivpn akses.bps.go.id:443 --username {username} --saml-login
INFO:   Listening for SAML login on port 8020
INFO:   Authenticate at 'https://akses.bps.go.id:443/remote/saml/start?redirect=1'
INFO:   Processing HTTP SAML request
INFO:   Connected to gateway.
INFO:   Authenticated.
INFO:   Remote gateway has allocated a VPN.
Using interface ppp0
Connect: ppp0 <--> /dev/pts/3
INFO:   Got addresses: [bps.go.id]
INFO:   Negotiation complete.
INFO:   Interface ppp0 is UP.
WARN:   Removing wrong route to vpn server...
INFO:   Setting new routes...
INFO:   Adding VPN nameservers...
INFO:   Tunnel is up and running.
```

## Conclusion

Besides FortiClient, OpenFortiVPN is an open-source alternative that is more stable for me. To make connecting easier, I created a desktop icon so that I can quickly launch the VPN connection with a single click.

```bash
[Desktop Entry]
Name=VPN BPS
Comment=Connect to BPS VPN
Exec=gnome-terminal -- bash -c "sudo openfortivpn akses.bps.go.id:443 -u {username} --saml-login; exec bash"
Icon=network-vpn
Terminal=false
Type=Application
Categories=Network;
```


