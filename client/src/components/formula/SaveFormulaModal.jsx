import { useState } from 'react';
import { Save, X, Plus, Globe, Lock, Sparkles } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useFormulaStore from '../../store/formulaStore';
import { CATEGORIES } from '../../utils/constants';

/**
 * Save Formula Modal - save a formula to personal library.
 * Supports name, description, tags, privacy, category, and named parameters.
 */
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

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-[4px] border border-ivory-3 bg-white px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-3">
            <Sparkles size={12} />
            Formula preview
          </div>
          <code className="break-all font-mono text-sm text-ink">{formulaSyntax}</code>
        </div>

        <Input
          label="Formula Name *"
          placeholder='e.g., "Monthly Net Profit"'
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error && !name ? error : ''}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">Description</label>
          <textarea
            placeholder="What does this formula do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-base w-full h-20 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-base w-full"
          >
            {CATEGORIES.filter((c) => c.value !== 'all').map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal/10 text-teal text-xs border border-teal/20"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="input-base flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              className="p-2.5 rounded-[4px] bg-white border border-ivory-3 text-ink-2 hover:border-ink-3 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[4px] border border-ivory-3 bg-white p-3">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe size={18} className="text-teal" />
            ) : (
              <Lock size={18} className="text-ink-3" />
            )}
            <div>
              <p className="text-sm font-medium text-ink">
                {isPublic ? 'Public - Marketplace' : 'Private - Only You'}
              </p>
              <p className="text-xs text-ink-3">
                {isPublic
                  ? 'Others can find and use this formula'
                  : 'Saved only to your personal library'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              isPublic ? 'bg-teal' : 'bg-navy-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                isPublic ? 'translate-x-5' : 'translate-x-0'
              }`}
              style={{ left: '2px' }}
            />
          </button>
        </div>

        {error && (
          <div className="rounded-[4px] border border-danger/20 bg-transparent px-4 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
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
