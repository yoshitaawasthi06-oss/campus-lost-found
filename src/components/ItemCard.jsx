import { MapPin, CalendarDays, ArrowUpRight } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Date not provided';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

export default function ItemCard({ item, onClaim ,onMarkClaimed}) {
  return (
    <article className="item-card">
      <div className="item-image-wrap">
        <img
          className="item-image"
          src={item.image || 'https://placehold.co/800x500?text=No+image'}
          alt={item.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = 'https://placehold.co/800x500?text=Image+unavailable';
          }}
        />
        <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
      </div>
      <div className="item-content">
        <div className="item-category">{item.category}</div>
        <h3>{item.name}</h3>
        <p className="item-description">{item.description || 'No additional description provided.'}</p>
        <div className="item-meta">
          <span><MapPin size={15} /> {item.location}</span>
          <span><CalendarDays size={15} /> {formatDate(item.date)}</span>
        </div>
        <button className="text-button" onClick={() => onClaim(item)}>
          {item.claimed ? (
  <span>Claimed ✔</span>
) : (
  <button onClick={() => onMarkClaimed(item.id)}>Mark as claimed</button>
)}
          {item.status === 'Found' ? 'Claim this item' : 'I found this item'}
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}
