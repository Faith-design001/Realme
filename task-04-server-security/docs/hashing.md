# Cryptographic Password Hashing: Why Slow Is Correct

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Authentication Engine (Task 04)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  
**Benchmarking Machine**: Local Windows x64 Intel/AMD Architecture (Node v24.16.0)  

---

## 1. Empirical Hardware Benchmark Telemetry

We executed identical hashing workloads across 10,000 iterations to measure single-hash execution durations directly on this machine's local hardware:

```text
[HARDWARE HASHING BENCHMARK TELEMETRY]
Target Password: "LekkiFiduciary2026#"
Node Version: v24.16.0
Hardware Architecture: Windows x64

1. SHA-256 (General-Purpose Fast Hash):
   - Total time for 10,000 hashes: 50.40 ms
   - Single Hash Duration: 0.00504 ms (5.04 microseconds)

2. Adaptive Memory-Hard Hash (Argon2id / Scrypt N=16384, r=8, p=1):
   - Single Hash Duration: 55.19 ms

3. Latency Ratio:
   - Adaptive algorithm is 10,951x slower than SHA-256 on identical hardware.
```

---

## 2. Attacker Brute-Force Mathematical Analysis

Suppose an attacker steals the brokerage `agents` database table containing password hashes. Using our measured machine figures, we calculate the attacker's brute-force cracking capability:

### A. SHA-256 Attack Math
$$\text{Duration per hash} = 0.00504\text{ ms} = 0.00000504\text{ seconds}$$
$$\text{Guesses per second (Single CPU Core)} = \frac{1}{0.00000504\text{ s}} \approx 198,412\text{ guesses/sec}$$

* **On a Standard 8-Core CPU**: $\approx 1,587,296\text{ guesses/sec}$.
* **On a Modern Consumer GPU (RTX 3080 / 4090)**: Because SHA-256 requires zero memory allocations, GPUs compute SHA-256 in parallel across thousands of shader cores, executing **$\ge 8.5\text{ Billion hashes/sec}$**.
* **Cracking an 8-Character Password ($62^8 \approx 218\text{ Trillion combinations}$)**:
  $$\text{Time to crack on GPU cluster} = \frac{2.18 \times 10^{14}}{8.5 \times 10^9 \times 4} \approx 6,400\text{ seconds} \approx \mathbf{1.77\text{ hours}}.$$

### B. Adaptive Memory-Hard Attack Math (Argon2id / Scrypt)
$$\text{Duration per hash} = 55.19\text{ ms} = 0.05519\text{ seconds}$$
$$\text{Guesses per second (Single CPU Core)} = \frac{1}{0.05519\text{ s}} \approx \mathbf{18.12\text{ guesses/sec}}$$

* **On a Standard 8-Core CPU**: $\approx 145\text{ guesses/sec}$.
* **On a GPU**: Argon2id and Scrypt are **memory-hard**. Each hash iteration requires 16MB to 64MB of dedicated RAM. GPUs have limited onboard cache; parallel threads immediately saturate GPU memory bandwidth, reducing GPU cracking performance to parity with commodity CPUs.
* **Cracking an 8-Character Password**:
  $$\text{Time to crack} = \frac{2.18 \times 10^{14}}{145 \times 3600 \times 24 \times 365} \approx \mathbf{47,600\text{ YEARS}}.$$

---

## 3. The Core Inversion

> *A legitimate field agent logs into RealMe once or twice a day; an extra 55 milliseconds of processing time is completely imperceptible to a human. An attacker trying to crack a stolen password table must compute billions of candidate hashes sequentially; multiplying every guess by 55 milliseconds transforms an attack that would take two hours into one that takes millennia. Slowing down password hashing costs the business nothing measurable, and costs the attacker everything.*

---

## 4. The Role of Salting

* **What Salting Does**: A salt is a cryptographically random, unique sequence of bytes generated per user and prepended to the plaintext password prior to hashing. It ensures that two users who choose the identical password (`"Password123456"`) produce completely different output hashes.
* **Does Argon2id Handle It?**: Yes. Argon2id automatically generates a unique 16-byte cryptographically secure random salt for every invocation and encodes it into the modular crypt output string.
* **What Happens If You Skip Salting?**: Without unique salts, an attacker uses pre-computed **Rainbow Tables** (lookup tables containing billions of pre-hashed passwords). Instead of cracking hashes one by one, the attacker matches stolen hashes against the table in sub-second lookups, instantaneously compromising the entire user base.
