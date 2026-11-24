# Architecture rules
- Phone journal browsing uses presentation-only helpers and units under `components/mobile`; keep the existing journal store and global audio singleton unchanged so editing and persistence stay compatible.
- Explore keeps its original tablet/desktop branch separate from the published-journal phone branch to isolate changes below 768px.