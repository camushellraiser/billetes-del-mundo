# v2.7.1 — regional browsing

- America is selected on first use; the latest manually selected region is stored locally. Search ignores region while a query is present; clearing search restores the chosen region. Clicking a region clears a search. Clear filters returns to America.
- Every region and All are limited to 24 cards initially. Show more appends 24 without replacing loaded cards. The results caption reports visible and total counts. Spanish and English labels are supported.
- Only rendered cards start cover requests; obsolete queued/active cover jobs are cancelled as a batch when replacing the grid or entering a country. Existing image caching, country detail prefetch and shared-currency indicators remain.
- Catalogue untouched: 110 countries and 671 denominations; 600 image pairs registered. External image speed still depends on source availability. No live Safari test.
