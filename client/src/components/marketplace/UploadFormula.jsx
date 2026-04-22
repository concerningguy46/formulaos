import { useState } from 'react';
import { Upload, X, Plus, DollarSign } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { marketplaceService } from '../../services/marketplaceService';
import { CATEGORIES } from '../../utils/constants';

/**
 * Upload formula/pack to marketplace dialog.
 */
const UploadFormula = ({ isOpen, onClose, prefillData = {} }) => {
  const [name, setName] = useState(prefillData.name || '');
  const [description, setDescription] = useState(prefillData.description || '');
  const [syntax, setSyntax] = useState(prefillData.syntax || '');
  const [category, setCategory] = useState(prefillData.category || 'other');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(prefillData.tags || []);
  const [price, setPrice] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !syntax.trim()) {
      setError('Name and formula syntax are required');
      return;
    }

    setUploading(true);
    try {
      await marketplaceService.upload({
        name: name.trim(),
        description: description.trim(),
        syntax,
        tags,
        category,
        price: parseFloat(price) || 0,
        type: 'formula',
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload to Marketplace" size="md">
      {success ? (
        <div className="text-center py-8 animate-scaleIn">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-navy-100">Uploaded!</h3>
          <p className="text-navy-400 text-sm mt-1">Your formula is now live on the marketplace.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name *"
            placeholder="e.g., Monthly Profit Calculator"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-navy-200">Description</label>
            <textarea
              placeholder="Describe what this formula does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-base w-full h-20 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-navy-200">Formula Syntax *</label>
            <textarea
              placeholder="=((B2-C2)/B2)*100"
              value={syntax}
              onChange={(e) => setSyntax(e.target.value)}
              className="input-base w-full h-16 resize-none font-mono text-teal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-navy-200">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-base w-full"
              >
                {CATEGORIES.filter((c) => c.value !== 'all').map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-navy-200">Price (USD)</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="number"
                  min="0"
                  max="49"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-base w-full pl-8"
                  placeholder="0 = Free"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-navy-200">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal/10 text-teal text-xs">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="input-base flex-1 text-sm"
              />
              <button type="button" onClick={addTag} className="p-2 rounded-lg bg-navy-700 text-navy-300 hover:bg-navy-600">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={uploading} icon={Upload}>
              Upload
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default UploadFormula;
