import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Star, User, ShoppingCart, Check } from 'lucide-react';
import { marketplaceService } from '../services/marketplaceService';
import { paymentService } from '../services/paymentService';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCurrency, formatCount, formatDate } from '../utils/formatters';

/**
 * Single listing detail page — full info with download/buy button.
 */
const ListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const result = await marketplaceService.getDetail(id);
        setListing(result.data);
      } catch (err) {
        console.error('Failed to load listing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();

    // Check if just purchased (redirect from Stripe)
    const params = new URLSearchParams(window.location.search);
    if (params.get('purchased') === 'true') {
      setPurchased(true);
    }
  }, [id]);

  /** Handle free download */
  const handleDownload = async () => {
    if (!user) return navigate('/login');
    setDownloading(true);
    try {
      await marketplaceService.download(id);
      setPurchased(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  /** Handle paid purchase (Stripe checkout) */
  const handlePurchase = async () => {
    if (!user) return navigate('/login');
    try {
      const result = await paymentService.createCheckout(id, listing.itemType);
      window.location.href = result.data.url;
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading listing..." />;
  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-navy-200">Listing not found</h2>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const isPaid = listing.price > 0;
  const isOwner = user && listing.userId?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-2 text-sm text-navy-400 hover:text-navy-200 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Marketplace
      </button>

      {/* Purchase success banner */}
      {purchased && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-success/10 border border-success/20 mb-6 animate-slideInUp">
          <Check size={18} className="text-success" />
          <p className="text-sm text-success">
            Formula added to your library! Go to the Editor to use it.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={listing.itemType === 'pack' ? 'gold' : 'teal'}>
                {listing.itemType === 'pack' ? '📦 Pack' : '📐 Formula'}
              </Badge>
              {listing.category && <Badge>{listing.category}</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-navy-100">{listing.name}</h1>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="glass-card-static p-5">
              <h3 className="text-sm font-medium text-navy-300 mb-2">Description</h3>
              <p className="text-navy-200 text-sm leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Formula Preview */}
          <div className="glass-card-static p-5">
            <h3 className="text-sm font-medium text-navy-300 mb-2">Formula Preview</h3>
            <div className="px-4 py-3 rounded-lg bg-navy-900 border border-navy-700">
              <code className="text-sm text-teal font-mono break-all">{listing.syntax}</code>
            </div>
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price & Action Card */}
          <div className="glass-card-static p-5">
            <div className="text-center mb-4">
              <span className={`text-3xl font-bold ${isPaid ? 'text-gold' : 'text-success'}`}>
                {formatCurrency(listing.price)}
              </span>
            </div>

            {isOwner ? (
              <div className="text-center text-navy-400 text-sm">This is your listing</div>
            ) : purchased ? (
              <Button variant="primary" className="w-full" onClick={() => navigate('/editor')}>
                Open in Editor
              </Button>
            ) : isPaid ? (
              <Button variant="gold" className="w-full" icon={ShoppingCart} onClick={handlePurchase}>
                Buy Now
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full"
                icon={Download}
                loading={downloading}
                onClick={handleDownload}
              >
                Download Free
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="glass-card-static p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-navy-400">Downloads</span>
              <span className="text-navy-200 font-medium">{formatCount(listing.downloadCount || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-navy-400">Rating</span>
              <span className="text-navy-200 font-medium flex items-center gap-1">
                <Star size={14} className="text-gold" />
                {listing.rating > 0 ? listing.rating.toFixed(1) : 'No ratings'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-navy-400">Published</span>
              <span className="text-navy-200">{formatDate(listing.createdAt)}</span>
            </div>
          </div>

          {/* Creator */}
          {listing.userId && (
            <div
              onClick={() => navigate(`/profile/${listing.userId._id}`)}
              className="glass-card p-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
                  <User size={18} className="text-navy-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-100">{listing.userId.name}</p>
                  <p className="text-xs text-navy-400">View profile →</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
