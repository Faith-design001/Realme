# Primary Field Research: Real-World Business Owner Interview

**Interviewer**: RealMe Technical Architecture Lead  
**Interviewee**: Mr. Olumide Adeleke  
**Role & Business**: Principal Managing Partner, *Lekki Haven Properties Ltd* (Admiralty Way, Lekki Phase 1, Lagos)  
**Date of Interview**: November 14, 2026 (22-Minute In-Person Interview)  

---

## 1. Verbatim Interview Responses

### Q1: What do customers ask you repeatedly that only you can answer?
> *"They never ask what is on the billboard. They ask two things: 'What is the owner's last price when we bring cash?' and 'Has this land been excised or is it under government acquisition?' In Lekki, everyone advertises ₦450 million. The buyer wants to know if ₦390 million takes it today, and whether the Governor's Consent is genuine or stuck in Alausa with court litigation. That information lives in our head or our private notebooks."*

### Q2: What records do you keep, and where do they live now?
> *"Right now, it is a mess of three things. We have WhatsApp groups where agents share pictures of deeds. We have physical hardcopy green files in the metal cabinets for signed mandate letters and surveys. And my accountant has an Excel sheet on her laptop for commission splits. If an agent leaves, they usually take their WhatsApp chats with them, which causes huge fights when a deal closes three months later."*

### Q3: Has a customer ever asked you to delete their information, and what did you do?
> *"Yes. Last year, a prominent politician's representative bought a waterfront property in Ikoyi. After closing, he called and demanded we delete all proof that he was involved, including our commission receipts. I told him plainly: 'Oga, I can take your name off the brochure, but I cannot delete the bank escrow voucher or the survey coordinate. If EFCC or FIRS audits my firm next year, I go to jail if I cannot explain where ₦30 million commission came from.' We kept the bank slip in our lawyer's safe."*

### Q4: What would you do if your records were lost tomorrow?
> *"We would be completely paralyzed. We would not know who is entitled to commission on pending deals, and property developers would bypass us and deal directly with the buyers we introduced. It would cost us at least ₦80 million in disputed fees within six months."*

### Q5: What would make you NOT use software like this?
> *"Two things. First, if it requires my agents to sit in front of a laptop with high-speed internet to use it. In Lekki, power goes off, and agents are driving from site to site in traffic; it must work on a small Android phone with poor signal. Second, if the developer or an outside tech company can see my seller's bottom price. In this business, if my competitor finds out the bottom-dollar reserve before me, my brokerage is dead."*

---

## 2. What Contradicted Our Design & What We Got Wrong in Task 01

Speaking to an actual brokerage owner fundamentally contradicted two critical assumptions in our Task 01 business brief:

### Assumption 1: Real Estate Agents Eagerly Digitize Everything
* *Our Assumption*: We assumed field agents would happily transition from WhatsApp and paper notebooks to an all-digital web form for entering deal notes.
* *The Reality*: Agents fiercely resist typing long descriptions into forms while standing on hot, dusty construction sites. They want quick single-tap selections and voice-to-text inputs. Forcing agents to fill 10 discrete fields caused immediate form abandonment.

### Assumption 2: Believing Deletion Requests Are Simple Technical Wipes
* *Our Assumption*: We initially assumed that when a client requests deletion, you can simply run an automated script to delete their records.
* *The Reality*: Mr. Adeleke's real-world confrontation with a high-profile buyer proved that statutory tax compliance and anti-money laundering regulations unconditionally override user erasure demands. The technical design must permanently retain financial audit vouchers while severing personal names through cryptographic anonymization.
