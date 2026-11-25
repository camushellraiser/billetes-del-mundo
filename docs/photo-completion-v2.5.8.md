# v2.5.8 — image performance and 5 added pairs

- Country covers start on page render instead of waiting for intersection. Six concurrent requests maximum, four for background jobs, host limits 2–3. Country details prefetch both sides of other notes, plus the opposite side of the selected note. Optional service worker caches up to 48 successful/opaque responses; failed images ask it to evict the URL. Browser may evict cache; initial page load may not be controlled by worker. Original URLs retained.
- 525/544 pairs registered, 19 missing. Pakistan 10 both sides inspected; Honduras 2 and 200 front checked, reverses HTTP 429; Nicaragua 500 and 1000 both URLs identified but HTTP 429. The 200 lempira is the 2026 commemorative design. No Safari test.

- pk-10: https://banknotenews.com/?p=50547
- hn-200: https://banknotenews.com/?p=49326
- hn-2: https://banknotenews.com/?p=43783
- ni-500: https://banknotenews.com/?p=39594
- ni-1000: https://banknotenews.com/?p=4441
