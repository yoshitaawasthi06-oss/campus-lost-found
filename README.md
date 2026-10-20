# CampusLoop — Campus Lost & Found Board

A responsive React + Vite demo that helps students browse, search, filter, and post lost or found items.

## Features

- Responsive layout for desktop, tablet, and mobile.
- Item cards with image, name, category, location, date, status, description, and contact.
- Debounced keyword search (300 ms).
- Category, location, and status filters.
- Sort by newest, oldest, or most relevant to the current search.
- Post-item modal with required-field validation and image preview.
- Image file type and 3 MB size checks.
- Skeleton loading state and helpful empty state.
- `localStorage` persistence for posts in this browser.
- Contact modal and email link for posters who provide an email address.
- No authentication or backend required.

## Requirements

Install a current Node.js LTS version, then use a terminal in this folder.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Production build

```bash
npm run build
npm run preview
```

Vite outputs the production build into `dist/`.

## Component structure

```text
src/
├── components/
│   ├── ItemCard.jsx    # Displays one item and its details
│   └── ItemForm.jsx    # Post form, validation, and image preview
├── data/
│   └── items.js        # Initial mock JSON-style data
├── App.jsx             # App layout, state, search, filters, sorting, storage
├── App.css             # App-specific layout and responsive styles
├── index.css           # Global styles and fonts
└── main.jsx            # React entry point
```

## Data and limitations

- Starter items live in `src/data/items.js`.
- New posts are saved to `localStorage` in the current browser only. They are not shared between different users or devices.
- Image previews selected from a computer use temporary browser object URLs. They are suitable for previewing, but not permanent image hosting. For a production app, upload images to a storage service or store a carefully size-limited image representation.
- “Most relevant” is a simple mock ranking based on matching the search text against item name, location, and category; it is not a real geographic-distance calculation.
- This is a student demo, not a secure production claims system. Avoid publishing sensitive personal details.

## Suggested manual tests

1. Search for “bottle”; confirm matching cards remain.
2. Filter category to “Electronics”.
3. Filter status to “Found”.
4. Change sort order to oldest and newest.
5. Post an item with required fields; confirm it appears at the top.
6. Refresh the browser; confirm text data remains.
7. Try submitting an empty form; confirm validation appears.
8. Upload a valid image and check its preview.
9. Search for an impossible word; confirm the empty state appears.
10. Narrow the browser window to check the mobile layout.
