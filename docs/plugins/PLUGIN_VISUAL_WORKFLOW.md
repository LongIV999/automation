# 🎨 Plugin Visual Workflow Guide

## 📊 Plugin Ecosystem Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATION PROJECT                           │
│                    (Multi-Brand Content)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
              ┌───────────────────────────┐
              │      AGENTS.md            │
              │  (Plugin Configuration)   │
              └───────────────────────────┘
                              │
              ┌───────────────┴────────────────┐
              │                                │
              ↓                                ↓
┌──────────────────────┐          ┌──────────────────────┐
│  DEVELOPMENT PHASE   │          │  MAINTENANCE PHASE   │
└──────────────────────┘          └──────────────────────┘
         │                                   │
         ↓                                   ↓
┌─────────────────┐                 ┌─────────────────┐
│ planning skill  │                 │ issue-resolution│
│                 │                 │     skill       │
│ • Discovery     │                 │                 │
│ • Synthesis     │                 │ • Triage        │
│ • Verification  │                 │ • Reproduction  │
│ • Decomposition │                 │ • Root Cause    │
│ • Track Plan    │                 │ • Fix           │
└────────┬────────┘                 │ • Verify        │
         │                          └─────────────────┘
         ↓
┌─────────────────┐
│ orchestrator    │
│     skill       │
│                 │
│ • Spawn Workers │
│ • Monitor       │
│ • Coordinate    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  worker skill   │
│  (Auto-spawned) │
│                 │
│ • Execute Beads │
│ • Report        │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ knowledge skill │
│                 │
│ • Extract       │
│ • Verify        │
│ • Document      │
└─────────────────┘
```

---

## 🔄 Workflow 1: Feature Development

```
USER REQUEST: "Add Instagram posting"
         │
         ↓
┌────────────────────────────────────────┐
│ STEP 1: Planning                       │
│ skill planning                         │
├────────────────────────────────────────┤
│ Discovery:                             │
│ ├─ Find Facebook posting code          │
│ ├─ Check Instagram API docs            │
│ └─ Review current architecture         │
│                                        │
│ Synthesis:                             │
│ ├─ Gap Analysis                        │
│ ├─ Approach Options                    │
│ └─ Risk Assessment (HIGH/MED/LOW)      │
│                                        │
│ Verification (Spikes):                 │
│ ├─ Spike: Test Instagram Graph API     │
│ ├─ Spike: Auth flow validation         │
│ └─ Learnings documented                │
│                                        │
│ Decomposition:                         │
│ ├─ bd-1: Add Instagram credentials     │
│ ├─ bd-2: Create uploader module        │
│ ├─ bd-3: Integrate to daily-agent      │
│ ├─ bd-4: Add error handling            │
│ └─ bd-5: Update documentation          │
│                                        │
│ Track Planning:                        │
│ ├─ Track 1: Infrastructure (bd-1,2)    │
│ └─ Track 2: Integration (bd-3,4,5)     │
└────────────────┬───────────────────────┘
                 │
                 ↓ execution-plan.md created
                 │
┌────────────────────────────────────────┐
│ STEP 2: Orchestration                 │
│ skill orchestrator                     │
├────────────────────────────────────────┤
│ Read: execution-plan.md                │
│ Initialize: Agent Mail                 │
│                                        │
│ Spawn Workers:                         │
│   ┌────────────────┐ ┌──────────────┐ │
│   │ BlueLake       │ │ GreenCastle  │ │
│   │ (Track 1)      │ │ (Track 2)    │ │
│   ├────────────────┤ ├──────────────┤ │
│   │ Execute bd-1   │ │ Wait for     │ │
│   │ Execute bd-2   │ │ Track 1      │ │
│   │ Report done    │ │              │ │
│   └────────────────┘ │ Execute bd-3 │ │
│                      │ Execute bd-4 │ │
│   Monitor:           │ Execute bd-5 │ │
│   ├─ Progress        │ Report done  │ │
│   ├─ Blockers        └──────────────┘ │
│   └─ Cross-deps                        │
└────────────────┬───────────────────────┘
                 │
                 ↓ All beads completed
                 │
┌────────────────────────────────────────┐
│ STEP 3: Documentation                 │
│ skill knowledge                        │
├────────────────────────────────────────┤
│ Extract:                               │
│ ├─ What changed                        │
│ ├─ Why changed                         │
│ └─ Key decisions                       │
│                                        │
│ Verify:                                │
│ ├─ Check code matches claims           │
│ └─ Validate with gkg tools             │
│                                        │
│ Update Docs:                           │
│ ├─ docs/WORKFLOW_MANAGEMENT.md         │
│ ├─ AGENTS.md                           │
│ └─ Architecture diagrams               │
└────────────────────────────────────────┘
                 │
                 ↓
         ✅ FEATURE COMPLETE
         ✅ DOCUMENTED
         ✅ READY FOR USE
```

---

## 🐛 Workflow 2: Bug Fixing

```
BUG REPORT: "Generator fails for Thach Vu Land"
         │
         ↓
┌────────────────────────────────────────┐
│ issue-resolution skill                 │
└────────────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────┐
│ PHASE 0: Triage                        │
├────────────────────────────────────────┤
│ Input: Vague report                    │
│ ├─ Classify: Severity HIGH             │
│ ├─ Type: Regression                    │
│ └─ Repro Required: Failing test        │
│                                        │
│ Output: Issue Brief                    │
│   ├─ Symptom                           │
│   ├─ Expected behavior                 │
│   └─ Affected area                     │
└────────────────┬───────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────┐
│ PHASE 1: Reproduction                 │
├────────────────────────────────────────┤
│ ├─ Read: brands/thachvuland/brand.json │
│ ├─ Run: generator-tvland.js            │
│ ├─ Capture: Error screenshots          │
│ └─ Create: Failing test                │
│                                        │
│ Output: Repro Report                   │
│   ├─ Test: test/generator-tvl.test.js  │
│   ├─ Code path traced                  │
│   └─ Error captured                    │
└────────────────┬───────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────┐
│ PHASE 2: Root Cause Analysis          │
├────────────────────────────────────────┤
│ Hypotheses:                            │
│ ├─ A: Color config not loaded          │
│ ├─ B: CSS override issue               │
│ └─ C: Font fallback missing            │
│                                        │
│ Evidence Gathering:                    │
│ ├─ Check generator-tvland.js:45        │
│ ├─ Git blame to find recent change     │
│ └─ Test with different configs         │
│                                        │
│ Confirmed Cause:                       │
│   ✓ Missing color.primary fallback     │
│   └─ Line 45: hardcoded longbest color │
│                                        │
│ Output: RCA Report                     │
└────────────────┬───────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────┐
│ PHASE 3: Impact Assessment             │
├────────────────────────────────────────┤
│ Blast Radius:                          │
│ ├─ Direct: generator-tvland.js         │
│ ├─ Callers: daily-agent.js             │
│ └─ Similar: generator.js (check)       │
│                                        │
│ Regression Risk: MEDIUM                │
│ └─ Only affects Thach Vu Land          │
│                                        │
│ Output: Impact Report                  │
└────────────────┬───────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────┐
│ PHASE 4: Fix                           │
├────────────────────────────────────────┤
│ Edit: scripts/carousel-generator/      │
│       generator-tvland.js:45           │
│                                        │
│ Change:                                │
│   - const color = '#C15F3C'            │
│   + const color = brand.colors.primary │
│   + || '#788c5d' // fallback           │
│                                        │
│ Test:                                  │
│ ├─ Run failing test → now passes       │
│ ├─ Test Long Best AI → still works    │
│ └─ Generate sample → colors correct    │
└────────────────┬───────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────┐
│ PHASE 5: Verification                 │
├────────────────────────────────────────┤
│ ✓ Regression test passes               │
│ ✓ Original bug fixed                   │
│ ✓ No new test failures                 │
│ ✓ Both brands work                     │
│                                        │
│ Commit:                                │
│   "fix: Use brand config colors        │
│    for Thach Vu Land generator"        │
└────────────────────────────────────────┘
                 │
                 ↓
         ✅ BUG FIXED
         ✅ TEST ADDED
         ✅ VERIFIED
```

---

## 🔀 Workflow 3: Parallel Multi-Brand Processing

```
USER REQUEST: "Generate 5 posts for each brand"
         │
         ↓
┌────────────────────────────────────────┐
│ STEP 1: Planning                       │
│ skill planning                         │
├────────────────────────────────────────┤
│ Beads Created:                         │
│   Long Best AI Track:                  │
│   ├─ bd-10: Generate post 1            │
│   ├─ bd-11: Generate post 2            │
│   ├─ bd-12: Generate post 3            │
│   ├─ bd-13: Generate post 4            │
│   └─ bd-14: Generate post 5            │
│                                        │
│   Thach Vu Land Track:                 │
│   ├─ bd-20: Generate post 1            │
│   ├─ bd-21: Generate post 2            │
│   ├─ bd-22: Generate post 3            │
│   ├─ bd-23: Generate post 4            │
│   └─ bd-24: Generate post 5            │
│                                        │
│ File Scopes:                           │
│   Track 1: brands/longbest-ai/**       │
│   Track 2: brands/thachvuland/**       │
└────────────────┬───────────────────────┘
                 │
                 ↓ execution-plan.md
                 │
┌────────────────────────────────────────┐
│ STEP 2: Orchestration                 │
│ skill orchestrator                     │
└────────────────────────────────────────┘
         │
         ↓ Spawn 2 workers
         │
    ┌────┴────┐
    │         │
    ↓         ↓
┌─────────────────┐    ┌─────────────────┐
│ Worker: BlueLake│    │Worker:GreenCastle│
│ (Long Best AI)  │    │ (Thach Vu Land)  │
├─────────────────┤    ├─────────────────┤
│ TIME: 0:00      │    │ TIME: 0:00       │
│ ├─ bd-10 START  │    │ ├─ bd-20 START   │
│ │  Writer       │    │ │  Writer        │
│ │  Generator    │    │ │  Generator     │
│ └─ COMPLETE 2min│    │ └─ COMPLETE 2min │
│                 │    │                  │
│ TIME: 2:00      │    │ TIME: 2:00       │
│ ├─ bd-11 START  │    │ ├─ bd-21 START   │
│ └─ COMPLETE 2min│    │ └─ COMPLETE 2min │
│                 │    │                  │
│ TIME: 4:00      │    │ TIME: 4:00       │
│ ├─ bd-12 START  │    │ ├─ bd-22 START   │
│ └─ COMPLETE 2min│    │ └─ COMPLETE 2min │
│                 │    │                  │
│ TIME: 6:00      │    │ TIME: 6:00       │
│ ├─ bd-13 START  │    │ ├─ bd-23 START   │
│ └─ COMPLETE 2min│    │ └─ COMPLETE 2min │
│                 │    │                  │
│ TIME: 8:00      │    │ TIME: 8:00       │
│ ├─ bd-14 START  │    │ ├─ bd-24 START   │
│ └─ COMPLETE 2min│    │ └─ COMPLETE 2min │
│                 │    │                  │
│ TIME: 10:00     │    │ TIME: 10:00      │
│ ✓ TRACK DONE    │    │ ✓ TRACK DONE     │
└─────────┬───────┘    └────────┬─────────┘
          │                     │
          └──────────┬──────────┘
                     │
                     ↓
            ┌────────────────┐
            │  Orchestrator  │
            │  Report        │
            ├────────────────┤
            │ Total Time:    │
            │   10 minutes   │
            │                │
            │ Sequential:    │
            │   20 minutes   │
            │                │
            │ Speedup: 2x    │
            └────────────────┘
                     │
                     ↓
         ✅ 10 POSTS CREATED
         ✅ BOTH BRANDS READY
         ✅ 2x FASTER
```

---

## 📈 Time Savings Comparison

### Sequential (Without Orchestrator)
```
Long Best AI (5 posts):    10 min
Thach Vu Land (5 posts):   10 min
────────────────────────────────
Total:                     20 min
```

### Parallel (With Orchestrator)
```
Both brands simultaneously: 10 min
────────────────────────────────
Total:                     10 min
Savings:                   50%
```

---

## 🎯 Decision Tree: Which Plugin?

```
START
  │
  ├─ Have a bug/error?
  │  └─ YES → skill issue-resolution
  │
  ├─ Want to add feature?
  │  └─ YES → skill planning
  │           └─ Complex/Multi-step?
  │              └─ YES → Then skill orchestrator
  │
  ├─ Finished epic/feature?
  │  └─ YES → skill knowledge
  │
  └─ Want parallel execution?
     └─ YES → skill planning → orchestrator
```

---

## 🔗 Plugin Dependencies

```
┌─────────────────┐
│    planning     │  (Independent)
└────────┬────────┘
         │ creates execution-plan.md
         ↓
┌─────────────────┐
│  orchestrator   │  (Needs planning output)
└────────┬────────┘
         │ spawns
         ↓
┌─────────────────┐
│     worker      │  (Auto-spawned by orchestrator)
└─────────────────┘

┌─────────────────┐
│issue-resolution │  (Independent)
└─────────────────┘

┌─────────────────┐
│   knowledge     │  (Independent, run after work done)
└─────────────────┘
```

---

## ✅ Integration Checklist

- [x] Plugins installed
- [x] AGENTS.md created
- [x] Project structure documented
- [x] Preferred tools specified
- [x] Use cases defined
- [x] Examples prepared
- [ ] **Try first plugin** ← Your turn!

---

**Visual guides complete!** 🎨

Next: Run `skill issue-resolution` để thử ngay!
