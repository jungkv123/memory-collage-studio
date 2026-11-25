# Architecture rules
- Phone journal browsing uses presentation-only helpers and units under `components/mobile`; keep the existing journal store and global audio singleton unchanged so editing and persistence stay compatible.
- Explore keeps its original tablet/desktop branch separate from the published-journal phone branch to isolate changes below 768px.- Phone editor immersion toggles a `editor-immersive` body class from create.tsx; CSS hides the tab bar so the global MobileTabBar stays untouched.
