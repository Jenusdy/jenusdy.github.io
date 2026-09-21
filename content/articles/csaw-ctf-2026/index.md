---
title: "Writeup CSAW CTF 2026."
description: "Comprehensive writeups and technical solutions for CSAW CTF 2026 by Jenusdy team, covering 9 challenges across Cryptography, Forensics, Pwn, Reverse Engineering, OSINT, and Misc."
date: "2026-09-21"
banner:
  src: "../../images/articles/csaw-ctf-2026/thumbnail.png"
  alt: "Writeup CSAW CTF 2026"
categories:
  - "Blog"
  - "CTF"
  - "Cyber Security"
keywords:
  - "CTF"
  - "CSAW"
  - "CSAW CTF 2026"
  - "Cryptography"
  - "Forensics"
  - "Pwn"
  - "Reverse Engineering"
  - "OSINT"
---

# Introduction

**CSAW CTF** is one of the most prominent student-run cybersecurity competitions in the world, founded and organized by the **OSIRIS Lab at NYU Tandon School of Engineering**. The competition covers a diverse spectrum of domains including Cryptography, Binary Exploitation (Pwn), Digital Forensics, Reverse Engineering, Open-Source Intelligence (OSINT), and Miscellaneous puzzles.

In this edition, I participated alongside the **Jenusdy** team. We solved **9 challenges** spanning multiple categories. Below is the complete summary of our solves, insights, and full technical walkthroughs.

---

## Solved Challenges Overview

| Category | Challenge | Key Concept | Flag |
| :--- | :--- | :--- | :--- |
| **Crypto** | [Finders Keepers!](#finders-keepers) | MP4 Metadata & Vigenère KPA | `csaw{y0u_@lw@ys_kn0w_wh3r3_t0_l00k}` |
| **Crypto** | [Secret Treaties](#secret-treaties) | Low-Density Knapsack / Lattice CVP (LLL) | `csaw{LLL_turns_kn4ps4cks_1nt0_p4nc4k3s_wh3n_d3ns1ty_1s_l0w}` |
| **Forensics** | [Ghost in the Machine](#ghost-in-the-machine) | PCAP Header Repair, Timing Channel & Port Modulation | `csaw{t1m1ng_1s_3v3ryth1ng_1n_th3_s1l3nt_ch4nn3l}` |
| **Forensics** | [Hemispheres](#hemispheres) | Blue Channel LSB & Polyglot Encrypted ZIP Carving | `csaw{0n3_f1l3_tw0_truth5_p0lygl0t_m4g1c}` |
| **Misc** | [House of Hollow Houses](#house-of-hollow-houses) | Static Web Labyrinth, Hidden Text & Multi-layer Encodings | `csaw{w4nd3r3r_0f_th3_h0ll0w_h0us3}` |
| **OSINT** | [Roll Call](#roll-call) | SQLite Schema Mapping & Watchlist Discrepancy Analysis | `csaw{halcyonleaks_still_water_77}` |
| **Pwn** | [Diamond Dogs](#diamond-dogs) | glibc 2.31 Heap Unsorted Bin Leak & UAF Function Pointer Overwrite | `csaw{w3dd1ngs_4r3_b4s1c4lly_fun3r4ls_w1th_c4k3}` |
| **Rev** | [masterkey](#masterkey) | 53-Block Bytecode VM & Modular Inverses | `csaw{cl1mb1ng_th3_v1rtu4l_st4ck_0n3_0pc0d3_4t_4_t1m3}` |
| **Rev** | [nitro](#nitro) | Self-Modifying ELF Binary & Runtime Code Decryption | `csaw{c0d3_th4t_rewr1t3s_1ts3lf_c4nt_b3_tru5t3d}` |

---

# 1. Cryptography

## Finders Keepers!
> **Tags:** Video Steganography, Known-Plaintext Attack (KPA), Vigenère Cipher

### About the Challenge
We are provided with an MP4 video file: `finderskeepers.mp4`. The title *"Finders Keepers!"* hints that something valuable is hidden inside the media container.

### Solution Walkthrough

#### 1. Metadata Extraction
Examining the raw metadata / XMP packet of the video file exposes an embedded `<dc:subject>` entry:

```xml
<dc:subject>
  <rdf:Bag>
    <rdf:li>ZXNucHtkMGNfQHl6QGdsX21uMGpfcG0zejNfZzBfbzAwc30=</rdf:li>
  </rdf:Bag>
</dc:subject>
```

Decoding the Base64 payload yields the ciphertext:
```python
import base64
ciphertext = base64.b64decode("ZXNucHtkMGNfQHl6QGdsX21uMGpfcG0zejNfZzBfbzAwc30=").decode()
# Output: esnp{d0c_@yz@gl_mn0j_pm3z3_g0_o00s}
```

#### 2. Known-Plaintext Attack (KPA)
Standard CSAW flags follow the pattern `csaw{...}`. Comparing the ciphertext `esnp{...}` with `csaw{...}`:
- `e` $\rightarrow$ `c`: shift $= (4 - 2) \pmod{26} = 2$ (`c`)
- `s` $\rightarrow$ `s`: shift $= (18 - 18) \pmod{26} = 0$ (`a`)
- `n` $\rightarrow$ `a`: shift $= (13 - 0) \pmod{26} = 13$ (`n`)
- `p` $\rightarrow$ `w`: shift $= (15 - 22) \pmod{26} = 19$ (`t`)

The key prefix is `cant`. Aligning with the challenge theme *"Finders Keepers"* ("can't find it"), the complete Vigenère key is **`cantfindit`**.

#### 3. Decryption Script
```python
def vigenere_decrypt(ciphertext: str, key: str) -> str:
    plaintext = []
    key_idx = 0
    key = key.lower()
    for ch in ciphertext:
        if ch.isalpha():
            base = ord('a') if ch.islower() else ord('A')
            c_val = ord(ch) - base
            k_val = ord(key[key_idx % len(key)]) - ord('a')
            p_val = (c_val - k_val) % 26
            plaintext.append(chr(p_val + base))
            key_idx += 1
        else:
            plaintext.append(ch)
    return ''.join(plaintext)

print(vigenere_decrypt("esnp{d0c_@yz@gl_mn0j_pm3z3_g0_o00s}", "cantfindit"))
```

![Finders Keepers Flag](../../images/articles/csaw-ctf-2026/crypto-finders-keepers-flag.png)

```text
Flag: csaw{y0u_@lw@ys_kn0w_wh3r3_t0_l00k}
```

---

## Secret Treaties
> **Tags:** Knapsack Cryptosystem, Subset Sum Problem, Lattice Reduction (LLL), Closest Vector Problem (CVP)

### About the Challenge
We are given a public key of 72 large integers (`pubkey.txt`) and a sequence of 7 ciphertext integers (`ciphertext.txt`).
- The cryptosystem is a Merkle-Hellman knapsack / subset sum problem.
- Public key size: $n = 72$ integers ($\approx 96$ bits each).
- Plaintext blocks: $9$ bytes $= 72$ bits each (MSB-first per byte).
- Density:
  $$d = \frac{n}{\log_2(\max(A))} \approx \frac{72}{96} \approx 0.75$$
- Because the density is low ($d < 0.9408$), the subset sum problem can be reduced to the Closest Vector Problem (CVP) on a lattice.

### Solution Walkthrough

#### 1. Centered Target Lattice Construction
Using the centered target technique (Coster et al. / CJLOSS), we shift binary variables $x_i \in \{0, 1\}$ to $2x_i - 1 \in \{-1, +1\}$.

We build an $n \times (n+1)$ lattice basis matrix $B$:
- Row $i$: $[2 \cdot A_i, 0, \dots, 2, \dots, 0]$ (with $2$ at column $i+1$)
- Target vector $T$: $[2C, 1, 1, \dots, 1]$

For any valid binary solution vector $x$, the difference vector $v - T$ is $[0, 2x_0 - 1, \dots, 2x_{n-1} - 1]$, which has exact Euclidean squared norm:
$$\|v - T\|^2 = \sum_{i=0}^{n-1} (\pm 1)^2 = 72$$

This makes CVP enumeration with LLL extremely fast ($\approx 0.03$s per block).

#### 2. Solve Script using `fpylll`
```python
from fpylll import IntegerMatrix, LLL, CVP

B = IntegerMatrix(n, n + 1)
for i in range(n):
    B[i, 0] = 2 * pubkey[i]
    B[i, i + 1] = 2

LLL.reduction(B)

full_flag = b""
for idx, ct in enumerate(ciphertexts):
    target = tuple([2 * ct] + [1] * n)
    v = CVP.closest_vector(B, target, method="fast")
    bits = [v[i + 1] // 2 for i in range(n)]
    
    block_bytes = bytes(
        sum(bits[byte_idx * 8 + bit_idx] << (7 - bit_idx) for bit_idx in range(8))
        for byte_idx in range(9)
    )
    full_flag += block_bytes

print("FLAG:", full_flag.decode())
```

Each 72-bit block decodes cleanly into 9 ASCII characters:
- Block 0: `csaw{LLL_`
- Block 1: `turns_kn4`
- Block 2: `ps4cks_1n`
- Block 3: `t0_p4nc4k`
- Block 4: `3s_wh3n_d`
- Block 5: `3ns1ty_1s`
- Block 6: `_l0w}`

![Secret Treaties Flag](../../images/articles/csaw-ctf-2026/crypto-secret-treaties-flag.png)

```text
Flag: csaw{LLL_turns_kn4ps4cks_1nt0_p4nc4k3s_wh3n_d3ns1ty_1s_l0w}
```

---

# 2. Digital Forensics

## Ghost in the Machine
> **Tags:** PCAP Forensics, Header Repair, Port Modulation, Covert Timing Channel

### About the Challenge
We are given a network capture file `capture.pcap` containing hidden covert communication.

### Solution Walkthrough

#### 1. Fixing PCAP Magic Bytes
Opening `capture.pcap` fails due to corrupted header magic:
- File starts with `0xc4c3b2a1` instead of standard little-endian PCAP magic `0xd4c3b2a1`.
- Changing byte `0xc4` $\rightarrow$ `0xd4` restores the valid file header.

#### 2. Stream Isolation & Key Recovery
- Filtering by `ip.ttl == 64` isolates the covert stream.
- The UDP source ports in this stream center around 40100. Calculating $p - 40000 = \text{ord}(c)$ gives characters `'s'`, `'h'`, `'4'`, `'d'`, `'o'`, `'w'`, uncovering the 6-byte repeating XOR key: **`sh4dow`**.

#### 3. Covert Timing Channel Extraction
Analyzing inter-packet arrival times ($\Delta t = t_i - t_{i-1}$) reveals two delay clusters:
- Short delay ($\approx 0.05$s) $\rightarrow$ bit `0`
- Long delay ($\approx 0.15$s) $\rightarrow$ bit `1`

By setting a threshold at $0.10$s, timestamps convert into binary bits, which are packed into bytes and XOR-decrypted with `sh4dow`.

![Ghost in the Machine Flag](../../images/articles/csaw-ctf-2026/forensic-ghost-flag.png)

```text
Flag: csaw{t1m1ng_1s_3v3ryth1ng_1n_th3_s1l3nt_ch4nn3l}
```

---

## Hemispheres
> **Tags:** PNG Steganography, LSB Extraction, Polyglot ZIP Carving

### About the Challenge
We are given an image file named `the_signal.png`. The challenge prompt describes two hemispheres: *"The Pixels"* holding the key, and *"The Tail"* holding the lock.

![The Signal Image](../../images/articles/csaw-ctf-2026/forensics-hemispheres-signal.png)

### Solution Walkthrough

#### 1. Key Extraction (Blue Channel LSB)
Extracting the LSB of the Blue channel across all pixels:
- The first 2 bytes store the length of the key as a 16-bit big-endian integer.
- The following bytes yield the password: **`r3ad_b3tw33n_th3_p1x3ls`**.

#### 2. ZIP Archive Carving
Inspecting bytes past the PNG `IEND` chunk reveals appended data starting with ZIP magic `PK\x03\x04`:
```python
with open("the_signal.png", "rb") as f:
    data = f.read()

zip_offset = data.find(b"PK\x03\x04")
zip_data = data[zip_offset:]
```

Decrypting the extracted archive with password `r3ad_b3tw33n_th3_p1x3ls` reveals `flag.txt`.

![Hemispheres Flag](../../images/articles/csaw-ctf-2026/forensics-hemispheres-flag.png)

```text
Flag: csaw{0n3_f1l3_tw0_truth5_p0lygl0t_m4g1c}
```

---

# 3. Miscellaneous

## House of Hollow Houses
> **Tags:** Web Labyrinth, Source Code Inspection, ROT13, Base64

### About the Challenge
We are given a link to a web maze: `https://hollow-houses.ctf.csaw.io/`.

![House of Hollow Houses Overview](../../images/articles/csaw-ctf-2026/misc-house-screenshot.png)

### Solution Walkthrough
Navigating through the rooms requires solving embedded clues at each step:
1. **Robots**: Checking `/robots.txt` reveals disallowed corridors.
2. **Invisible letters**: Inspecting DOM elements exposes CSS styled text with identical foreground/background colors.
3. **Sixty-four-character rite**: Base64 strings embedded in comments.
4. **Mirror**: Inverting backward string URLs.
5. **Half-turned alphabet**: ROT13 decoding for room paths.

Following this sequence leads to `https://hollow-houses.ctf.csaw.io/sanctum/`, where the flag is displayed.

![House of Hollow Houses Flag](../../images/articles/csaw-ctf-2026/misc-house-flag.png)

```text
Flag: csaw{w4nd3r3r_0f_th3_h0ll0w_h0us3}
```

---

# 4. OSINT

## Roll Call
> **Tags:** Database Forensics, SQLite Analysis, Identity Resolution

### About the Challenge
We are provided with case files including `intake.db`, communication logs, and watchlist CSV files. Our task is to determine which escalated individuals are absent from the surveillance watchlist.

### Solution Walkthrough
Because single persons maintain multiple usernames/handles across platforms:
1. Query `identities` table to map all aliases to unique `person_id`s.
2. Determine `person_id` set present in `watchlist`.
3. Determine `person_id` set present in `escalations`.
4. Identify the difference:
   $$\text{Missing} = \text{Escalated Persons} \setminus \text{Watchlist Persons}$$

```python
import sqlite3

conn = sqlite3.connect("roll-call/case_file/intake.db")
cur = conn.cursor()

cur.execute("SELECT handle, person_id FROM identities")
handle_to_person = dict(cur.fetchall())

cur.execute("SELECT handle FROM watchlist")
watchlist_pids = {handle_to_person[h] for (h,) in cur.fetchall() if h in handle_to_person}

cur.execute("SELECT DISTINCT handle FROM escalations")
escalated_pids = {handle_to_person[h] for (h,) in cur.fetchall() if h in handle_to_person}

missing_pids = escalated_pids - watchlist_pids

missing_handles = []
for pid in missing_pids:
    cur.execute("SELECT handle FROM identities WHERE person_id = ? ORDER BY is_primary DESC", (pid,))
    missing_handles.append(cur.fetchone()[0].lower())

missing_handles.sort()
print(f"csaw{{{'_'.join(missing_handles)}}}")
```

The missing individuals correspond to handles `halcyonleaks` and `still_water_77`.

![Roll Call Flag](../../images/articles/csaw-ctf-2026/osint-roll-call-flag.png)

```text
Flag: csaw{halcyonleaks_still_water_77}
```

---

# 5. Binary Exploitation (Pwn)

## Diamond Dogs
> **Tags:** Linux Heap Exploitation, glibc 2.31, Unsorted Bin Leak, Use-After-Free (UAF)

### About the Challenge
We are given a 64-bit ELF binary `guard-dog` running with `libc-2.31.so`.
```text
Arch:     amd64-64-little
RELRO:    Partial RELRO
Stack:    No canary found
NX:       NX enabled
PIE:      No PIE (0x3ff000)
```

The interactive menu offers:
1) adopt dog, 2) command dog, 3) release dog, 4) file note, 5) read note, 6) shred note.

### Solution Walkthrough

#### 1. Vulnerability Analysis
- **Unsorted Bin Leak (UAF read on notes)**: `shred note` frees note memory, but `read note` permits reading without zeroing pointers.
- **Dog Struct UAF**: Adopting a dog allocates a `0x20` struct:
  ```c
  struct Dog {
      char name[0x18];
      void (*command_fn)(char *);
  };
  ```
  Releasing a dog frees this struct into the `0x20` tcache bin without clearing kennel pointers.

#### 2. Libc Base Leak
In glibc 2.31, allocating a note larger than `0x408` (e.g., `0x500`) bypasses tcache. When freed, it enters the unsorted bin:
- Read note 0 to leak `fd` pointing to `main_arena + 96` (`offset = 0x1ecbe0`).
- Compute `libc_base = fd - 0x1ecbe0` and `system = libc_base + libc.symbols['system']`.

#### 3. Overwriting Function Pointer
1. Adopt dog at kennel 0 with name `"/bin/sh\x00"`.
2. Release dog 0 (returns chunk to `0x20` tcache bin).
3. Allocate note 2 with size `0x20` — tcache returns the dog struct memory!
4. Write payload:
   ```python
   payload = b"/bin/sh\x00" + b"A" * 0x10 + p64(system_addr)
   ```
5. Trigger option 2 (`command dog 0`). The binary executes `dog->command_fn(dog->name)` $\rightarrow$ `system("/bin/sh")`, spawning a root shell!

![Diamond Dogs Flag](../../images/articles/csaw-ctf-2026/pwn-diamond-dogs-flag.png)

```text
Flag: csaw{w3dd1ngs_4r3_b4s1c4lly_fun3r4ls_w1th_c4k3}
```

---

# 6. Reverse Engineering

## masterkey
> **Tags:** Custom Virtual Machine, Bytecode Reversing, Modular Inverses

### About the Challenge
We are given a 64-bit ELF binary `masterkey` implementing a custom virtual machine with 53 sequential transformation stages.

### Solution Walkthrough
Disassembling the VM reveals an internal state variable $r_1$ (initialized to `0x3c`). For each byte $x$ at step $i$:
1. $x \gets x \oplus A_i$
2. $x \gets (x + B_i) \pmod{256}$
3. $x \gets \text{rol8}(x, K_i)$
4. $x \gets x \oplus 0xc3$
5. $x \gets (x \times 0x1b) \pmod{256}$
6. $x \gets x \oplus r_1$
7. Assert $x == T_i$

Following validation, $r_1$ updates dynamically:
$$r_1 \gets (\text{rol8}(r_1 + x_{\text{input}}, K2_i) \oplus 0x9e) \pmod{256}$$

Since every operation is bijective, we invert each step backward:
- Modular inverse: $0x1b^{-1} \equiv 0x13 \pmod{256}$ ($27 \times 19 = 513 \equiv 1 \pmod{256}$).
- Reverse rotation, subtraction, and XOR:

```python
x = T ^ r1
x = (x * 0x13) & 0xff
x ^= 0xc3
x = ror8(x, K)
x = (x - B) & 0xff
x ^= A

# Update r1 for next stage
r1 = rol8((r1 + x) & 0xff, K2) ^ 0x9e
```

Running the inversion across all 53 blocks yields the flag.

![masterkey Flag](../../images/articles/csaw-ctf-2026/rev-masterkey-flag.png)

```text
Flag: csaw{cl1mb1ng_th3_v1rtu4l_st4ck_0n3_0pc0d3_4t_4_t1m3}
```

---

## nitro
> **Tags:** Self-Modifying Code, Runtime Decryption, mprotect

### About the Challenge
We are given an ELF binary `nitro` that unlocks functionality only when passed a secret command-line argument.

### Solution Walkthrough
Static analysis in IDA / Ghidra shows:
- The binary calls `mprotect` on its own `.text` segment to make code writable.
- Checking `argv[1]`: if it matches `"n2o_boost"`, it triggers an inline decryption loop for a 349-byte code blob at `0x40130e`.
- The decrypted code XOR-decodes the flag table using a deterministic formula.

Simply executing the binary with the required parameter unlocks the routine:
```bash
$ ./nitro n2o_boost
NITRO ENGAGED: csaw{c0d3_th4t_rewr1t3s_1ts3lf_c4nt_b3_tru5t3d}
```

![nitro Flag](../../images/articles/csaw-ctf-2026/rev-nitro-flag.png)

```text
Flag: csaw{c0d3_th4t_rewr1t3s_1ts3lf_c4nt_b3_tru5t3d}
```

---

# Conclusion & Source Files

All challenge files, scripts, and captures used in this writeup are available on my GitHub repository:
👉 [**Jenusdy/ctf-writeups (2026/CSAW)**](https://github.com/Jenusdy/ctf-writeups/tree/main/2026/CSAW)
