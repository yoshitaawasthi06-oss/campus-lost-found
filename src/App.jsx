import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, SlidersHorizontal, PackageSearch, HeartHandshake, CircleHelp } from 'lucide-react';
import ItemCard from './components/ItemCard.jsx';
import ItemForm from './components/ItemForm.jsx';
import { starterItems } from './data/items.js';
import './App.css';

const STORAGE_KEY = 'campusloop-items-v1';

function readItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterItems;
  } catch {
    return starterItems;
  }
}

export default function App() {
  const [items, setItems] = useState(readItems);const handleMarkClaimed= (id) => {
  setItems(items.map(item =>
    item.id === id ? { ...item, claimed: true } : item
  ));
};
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [location, setLocation] = useState('All locations');
  const [status, setStatus] = useState('All statuses');
  const [sort, setSort] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debounce the search so filtering waits briefly after typing stops.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Mock a brief first load so skeleton cards can be seen.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {
      // Browser storage can be full or disabled; the app remains usable for this session.
    }
  }, [items]);

  const locations = useMemo(() => [...new Set(items.map(item => item.location).filter(Boolean))].sort(), [items]);
  const categories = useMemo(() => [...new Set(items.map(item => item.category).filter(Boolean))].sort(), [items]);

  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      const searchable = `${item.name} ${item.category} ${item.location} ${item.description || ''}`.toLowerCase();
      return (!search || searchable.includes(search))
        && (category === 'All categories' || item.category === category)
        && (location === 'All locations' || item.location === location)
        && (status === 'All statuses' || item.status === status);
    });

    if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    if (sort === 'oldest') result.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
    if (sort === 'relevant') {
      result.sort((a, b) => {
        const score = item => (search && item.name.toLowerCase().includes(search) ? 3 : 0)
          + (search && item.location.toLowerCase().includes(search) ? 2 : 0)
          + (search && item.category.toLowerCase().includes(search) ? 1 : 0);
        return score(b) - score(a);
      });
    }
    return result;
  }, [items, search, category, location, status, sort]);

  function addItem(newItem) {
    setItems(current => [newItem, ...current]);
    setShowForm(false);
    setSearchInput('');
    setSearch('');
    setCategory('All categories');
    setLocation('All locations');
    setStatus('All statuses');
    setSort('newest');
  }

  function handleClaim(item) {
    setSelectedItem(item);
  }

  function resetFilters() {
    setSearchInput('');
    setSearch('');
    setCategory('All categories');
    setLocation('All locations');
    setStatus('All statuses');
    setSort('newest');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="CampusLoop home">
          <span className="brand-mark"><HeartHandshake size={23} /></span>
          <span>campus<span className="brand-accent">loop</span><small>LOST & FOUND</small></span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          <a className="active" href="#items">Browse items</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <button className="button primary header-cta" onClick={() => setShowForm(true)}><Plus size={18} /> Post an item</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-pill"><span className="live-dot" /> YOUR CAMPUS, CONNECTED</span>
            <h1>Lost something?<br /><span>Let's bring it home.</span></h1>
            <p>A little help goes a long way. Find misplaced belongings or help a classmate reunite with theirs.</p>
            <button className="button primary hero-cta" onClick={() => setShowForm(true)}><Plus size={18} /> Post lost or found item</button>
            <div className="hero-note"><HeartHandshake size={16} /> Community-powered. Campus-connected.</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle circle-one"></div><div className="art-circle circle-two"></div>
            <div className="art-card art-card-top"><span className="art-icon blue">⌁</span><span><b>Found something?</b><small>Help it find its owner</small></span><span className="art-check">✓</span></div>
            <div className="art-object"><span className="object-cap"></span><span className="object-body"><span className="object-label">CAMPUS<br />BUDDY</span></span></div>
            <div className="art-card art-card-bottom"><span className="art-icon green">↗</span><span><b>One small post</b><small>One happy reunion</small></span></div>
            <span className="spark spark-one">✳</span><span className="spark spark-two">✦</span>
          </div>
        </section>

        <section className="stats-strip" aria-label="Board overview">
          <div><span className="stat-icon"><PackageSearch size={19} /></span><span><strong>{items.length}</strong><small>Community posts</small></span></div>
          <div><span className="stat-icon green-icon"><HeartHandshake size={19} /></span><span><strong>{items.filter(item => item.status === 'Found').length}</strong><small>Items found</small></span></div>
          <div><span className="stat-icon amber-icon"><CircleHelp size={19} /></span><span><strong>{items.filter(item => item.status === 'Lost').length}</strong><small>Still missing</small></span></div>
        </section>

        <section className="board-section" id="items">
          <div className="section-heading">
            <div><p className="eyebrow">THE COMMUNITY BOARD</p><h2>Find your missing piece.</h2><p className="muted">Browse recent posts from around campus.</p></div>
            <span className="results-count">{filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}</span>
          </div>

          <div className="filter-panel">
            <label className="search-box"><Search size={19} /><input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search items, places, keywords..." aria-label="Search items" /><kbd>⌕</kbd></label>
            <div className="filter-selects">
              <label><span>Category</span><select value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
              <label><span>Location</span><select value={location} onChange={e => setLocation(e.target.value)}><option>All locations</option>{locations.map(value => <option key={value}>{value}</option>)}</select></label>
              <label><span>Status</span><select value={status} onChange={e => setStatus(e.target.value)}><option>All statuses</option><option>Lost</option><option>Found</option></select></label>
              <label><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="relevant">Most relevant</option></select></label>
            </div>
            <div className="filter-footer"><span><SlidersHorizontal size={14} /> Refine your search</span><button onClick={resetFilters} className="clear-button">Clear filters</button></div>
          </div>

          {loading ? (
            <div className="item-grid">{[1, 2, 3, 4, 5, 6].map(number => <div className="skeleton-card" key={number}><div className="skeleton-image"></div><div className="skeleton-line short"></div><div className="skeleton-line"></div><div className="skeleton-line medium"></div></div>)}</div>
          ) : filteredItems.length ? (
            <div className="item-grid">{filteredItems.map(item => <ItemCard key={item.id} item={item} onClaim={handleClaim} onMarkClaimed={handleMarkClaimed} />)}</div>
          ) : (
            <div className="empty-state"><div className="empty-icon"><PackageSearch size={30} /></div><h3>No items found</h3><p>Try a different keyword or clear some filters to see more posts.</p><button className="button secondary" onClick={resetFilters}>Clear all filters</button></div>
          )}
        </section>

        <section className="how-section" id="how-it-works">
          <p className="eyebrow">GOOD THINGS HAPPEN TOGETHER</p><h2>Three steps to a reunion.</h2>
          <div className="how-grid">
            <div><span className="step-number">01</span><h3>Post the details</h3><p>Share what went missing or what you found, along with a location and date.</p></div>
            <div><span className="step-number">02</span><h3>Search the board</h3><p>Use keywords and filters to spot a possible match around campus.</p></div>
            <div><span className="step-number">03</span><h3>Make contact</h3><p>Use the post's contact details to arrange a safe return.</p></div>
          </div>
        </section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark"><HeartHandshake size={20} /></span><span>campus<span className="brand-accent">loop</span></span></a><span>Small posts. Happy reunions.</span><span>CampusLoop · Student community project</span></footer>

      {showForm && <ItemForm onClose={() => setShowForm(false)} onSubmit={addItem} />}
      {selectedItem && (
        <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedItem(null); }}>
          <section className="modal contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <div className="modal-heading"><div><p className="eyebrow">MAKE A CONNECTION</p><h2 id="contact-title">{selectedItem.status === 'Found' ? 'Claim this item' : 'Help find this item'}</h2></div><button className="icon-button" onClick={() => setSelectedItem(null)} aria-label="Close"><span>×</span></button></div>
            <p className="muted">Before arranging a handover, ask the poster to confirm a detail that isn't visible in the photo.</p>
            <div className="contact-item"><strong>{selectedItem.name}</strong><span>{selectedItem.location} · {selectedItem.status}</span></div>
            <p><strong>Contact the poster:</strong></p>
            <p className="contact-detail">{selectedItem.contact || 'No contact details provided.'}</p>
            {selectedItem.contact?.includes('@') && <a className="button primary full-button" href={`mailto:${selectedItem.contact}?subject=${encodeURIComponent(`CampusLoop: ${selectedItem.name}`)}`}>Email poster</a>}
            <button className="button secondary full-button" onClick={() => setSelectedItem(null)}>Close</button>
            <p className="privacy-note">Safety tip: meet in a public campus location and never share passwords or verification codes.</p>
          </section>
        </div>
      )}
    </div>
  );
}
