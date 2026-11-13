---
title: "Extract an Android APK Without Installing Additional Tools"
description: "Extracting an Android APK file without installing additional tools refers to retrieving the original application package directly from a device using built-in system capabilities. This approach is useful for backup, analysis, or redistribution within permitted use cases, and avoids reliance on third-party applications."
date: "2026-04-04"
banner:
  src: "../../images/articles/extract-android-apk/thumbnail.png"
  alt: "Writeup Patriot CTF 2025"
categories:
  - "Android Hacking"
keywords:
  - "Android"
  - "APK"
  - "Cyber Security"
---

# Prerequisites

- You have a cable to connect your Android Phone to your PC
- You have to know how to turn on developer mode on your Android Phone
- You know some bacisc CLI 

# Introduction

On Android, when we want to make some changes on app


### Cipher from Hell

We were given two file, first one is encrypted flag [ENCRYPTED](https://github.com/Jenusdy/ctf-writeups/blob/main/2025/PatriotCTF%202025/Cryptography/Cipher%20from%20Hell/encrypted) and another file is source code that used to encrypt the flag

```python
import math, sys

inp = input("Enter your flag... ").encode()

s = int.from_bytes(inp)

o = (
	(6, 0, 7),
	(8, 2, 1),
	(5, 4, 3)
)

c = math.floor(math.log(s, 3))

if not c % 2:
	sys.stderr.write("Error: flag length needs to be even (hint: but in what base system?)!\n")
	sys.exit(1)

ss = 0

while c > -1:
	ss *= 9
	ss += o[s//3**c][s%3]
	
	s -= s//3**c*3**c
	s //= 3
	c -= 2

open("encrypted", 'wb').write(ss.to_bytes(math.ceil(math.log(ss, 256)), byteorder='big'))
```

From this source code we can analyze the way the flag was encrypted. So the main point we have to reverse the process to get the flag. Below is the script I used to solve this encrypted flag

```python
import math

hex_string = (
    "e61233fef5fc46032f8c377c3f0f731e"
    "53923da8a656be6da1661764cdb090ca"
    "bba59dede782d0792283664b"
)

encrypted_int = int(hex_string, 16)

inverse_map = {
    6: (0, 0), 0: (0, 1), 7: (0, 2),
    8: (1, 0), 2: (1, 1), 1: (1, 2),
    5: (2, 0), 4: (2, 1), 3: (2, 2)
}

curr = encrypted_int
base9_digits = []

while curr > 0:
    base9_digits.append(curr % 9)
    curr //= 9

base9_digits = base9_digits[::-1] 

left_trits = []
right_trits_reversed = []

for digit in base9_digits:
    row, col = inverse_map[digit]
    left_trits.append(row)
    right_trits_reversed.append(col)

all_trits = left_trits + right_trits_reversed[::-1]

flag_int = 0
for trit in all_trits:
    flag_int = flag_int * 3 + trit

byte_len = (flag_int.bit_length() + 7) // 8
try:
    flag = flag_int.to_bytes(byte_len, byteorder='big')
    print(f"Recovered Flag: {flag.decode('utf-8')}")
except Exception as e:
    print(f"Error decoding bytes: {e}")
    print(f"Raw bytes: {flag_int.to_bytes(byte_len, byteorder='big')}")
```
If we try to run the code we will get the flag as shown below

```
pctf{a_l3ss_cr4zy_tr1tw1s3_op3r4ti0n_f37d4b}
```

## On Going Writeup


