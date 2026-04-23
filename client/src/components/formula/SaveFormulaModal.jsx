import { useState } from 'react';
import { Save, X, Plus, Globe, Lock, Sparkles } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useFormulaStore from '../../store/formulaStore';
import { CATEGORIES } from '../../utils/constants';

const SaveFormulaModal = ({ isOpen, onClose, formulaSyntax }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState('other');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { saveFormula } = useFormulaStore();

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => setTags(tags.filter((t) => t !== tagToRemove));

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Formula name is required');
      return;
    }

    setSaving(true);
    const result = await saveFormula({
      name: name.trim(),
      description: description.trim(),
      tags,
      syntax: formulaSyntax,
      isPublic,
      category,
    });
    setSaving(false);

    if (result.success) {
      setName('');
      setDescription('');
      setTags([]);
      setCategory('other');
      setIsPublic(false);
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Formula" size="md">
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div style={{ border: '1px solid var(--ivory-3)', borderRadius: '14px', background: 'white', padding: '14px 16px' }}>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            <Sparkles size={12} />
            Formula preview
          </div>
          <code style={{ wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '14px', color: 'var(--ink)' }}>{formulaSyntax}</code>
        </div>

        <Input
          label="Formula Name *"
          placeholder='e.g., "Monthly Net Profit"'
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error && !name ? error : ''}
          required
        />

        <div style={{ display: 'grid', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            Description
          </label>
          <textarea
            placeholder="What does this formula do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              minHeight: '92px',
              padding: '13px 14px',
              borderRadius: '10px',
              border: '1px solid var(--ivory-3)',
              background: 'white',
              color: 'var(--ink)',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '13px 14px',
              borderRadius: '10px',
              border: '1px solid var(--ivory-3)',
              background: 'white',
              color: 'var(--ink)',
            }}
          >
            {CATEGORIES.filter((c) => c.value !== 'all').map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            Tags
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map((tag) => (
              <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '999px', background: 'rgba(0,212,170,0.08)', color: 'var(--teal-text)', border: '1px solid rgba(0,212,170,0.18)', fontSize: '12px' }}>
                {tag}
                <button type="button" onClick={() => removeTag(tag)} style={{ border: 0, background: 'transparent', color: 'inherit', padding: 0, display: 'grid', placeItems: 'center' }}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              style={{
                flex: 1,
                padding: '13px 14px',
                borderRadius: '10px',
                border: '1px solid var(--ivory-3)',
                background: 'white',
                color: 'var(--ink)',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={addTag}
              style={{ width: '46px', borderRadius: '10px', border: '1px solid var(--ivory-3)', background: 'white', color: 'var(--ink-2)' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', border: '1px solid var(--ivory-3)', borderRadius: '14px', background: 'white', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isPublic ? <Globe size={18} color="var(--teal-text)" /> : <Lock size={18} color="var(--ink-3)" />}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{isPublic ? 'Public - Marketplace' : 'Private - Only You'}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{isPublic ? 'Others can find and use this formula' : 'Saved only to your personal library'}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            style={{
              width: '52px',
              height: '28px',
              borderRadius: '999px',
              border: '1px solid var(--ivory-3)',
              background: isPublic ? 'var(--teal)' : 'var(--ivory-2)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: isPublic ? '26px' : '2px',
                width: '22px',
                height: '22px',
                borderRadius: '999px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(28,26,23,0.18)',
              }}
            />
          </button>
        </div>

        {error ? (
          <div style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(185, 74, 69, 0.25)', background: 'rgba(185, 74, 69, 0.05)', color: 'var(--danger)', fontSize: '13px' }}>
            {error}
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '2px' }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={saving} icon={Save}>
            Save Formula
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SaveFormulaModal;
