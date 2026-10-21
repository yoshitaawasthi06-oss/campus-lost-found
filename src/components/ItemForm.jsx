import { useEffect, useState } from 'react';
import { X, ImagePlus } from 'lucide-react';

const initialForm = {
  name: '', category: 'Accessories', location: '', date: new Date().toISOString().slice(0, 10),
  status: 'Lost', description: '', contact: '', image: ''
};

export default function ItemForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function update(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Please choose an image smaller than 3 MB.');
      return;
    }
    setError('');
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    update('image', objectUrl);
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.date || !form.contact.trim()) {
      setError('Please fill in the item name, location, date and contact details.');
      return;
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      contact: form.contact.trim(),
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">HELP YOUR CAMPUS</p>
            <h2 id="form-title">Post an item</h2>
            <p className="muted">Share a few details so the right person can find it.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close form"><X /></button>
        </div>
        <form onSubmit={submit} className="item-form">
          <label>Item name *
            <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Blue water bottle" maxLength={70} required />
          </label>
          <div className="form-row">
            <label>Post type *
              <select value={form.status} onChange={e => update('status', e.target.value)}>
                <option>Lost</option><option>Found</option>
              </select>
            </label>
            <label>Category *
              <select value={form.category} onChange={e => update('category', e.target.value)}>
                {['Accessories', 'Electronics', 'Stationery', 'Keys', 'Clothing', 'Bags', 'Other'].map(option =>
                  <option key={option}>{option}</option>
                )}
              </select>
            </label>
          </div>
          <label>Campus location *
            <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Central Library" maxLength={80} required />
          </label>
          <div className="form-row">
            <label>Date *
              <input type="date" value={form.date} max={new Date().toISOString().slice(0, 10)} onChange={e => update('date', e.target.value)} required />
            </label>
            <label>Contact email or phone *
              <input value={form.contact} onChange={e => update('contact', e.target.value)} placeholder="How can someone reach you?" maxLength={100} required />
            </label>
          </div>
          <label>Description
            <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Add identifying details (avoid sharing sensitive information)." rows="3" maxLength={350} />
          </label>
          <label className="upload-box">
            <ImagePlus size={21} />
            <span><strong>Add an image</strong><small>Optional · JPG, PNG or other image · up to 3 MB</small></span>
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>
          {preview && <div className="preview-wrap"><img src={preview} alt="Preview of selected item" /><button type="button" className="small-button" onClick={() => { URL.revokeObjectURL(preview); setPreview(''); update('image', ''); }}>Remove image</button></div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button primary">Publish item</button>
          </div>
        </form>
      </section>
    </div>
  );
}
