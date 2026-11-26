# v2.8.0 — interactive world map and numismatic profiles

- Five clickable continent silhouettes, no geographic labels inside; America combines North and South America. Geometry derived from Natural Earth public-domain low-resolution boundaries, dissolved by region, simplified and projected in Robinson. Russia's European/Asian divide is approximate; the map is a navigation diagram, not a boundary authority. Antarctica omitted because it has no national banknote issuer.
- Map and existing region chips use the same state; keyboard Enter/Space and accessibility labels supported. Existing global search, last-region memory, 24-card batches and image loading remain.
- All 110 country and 671 note records have base profiles derived from existing catalogue values. 10 country profiles and 52 individual note profiles have additional official-source-backed fields in api/v1/technical.json. Unknown fields omitted; catalogue scope clearly distinguished from all valid issues. No banknote records or image links changed. No browser test.
- Sources: mx: https://blog.banxico.org.mx/blog/BlogBanxico/entry/nueva-familia-de-billetes-g
- us: https://www.uscurrency.gov/about-us/currency-facts
- gb: https://www.bankofengland.co.uk/banknotes/current-banknotes
- fr: https://www.ecb.europa.eu/euro/banknotes/europa/html/index.en.html
- ch: https://www.snb.ch/en/the-snb/mandates-goals/cash/lifecycle
- au: https://www.rba.gov.au/education/topics/banknotes/
- nz: https://www.rbnz.govt.nz/money-and-cash/banknotes-and-coins/banknotes-in-circulation/explore-banknote-features
- jp: https://www.boj.or.jp/en/note_tfjgs/note/n_note/index.htm
- no: https://www.norges-bank.no/en/topics/notes-and-coins/legal-tender-notes-coins/
- ca: https://www.bankofcanada.ca/banknotes/
