import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, Share2, MapPin, Calendar, Package, Flag, MessageCircle,
  ChevronLeft, ChevronRight, AlertCircle, ArrowRight, Tag, Check, X, Ban,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import VerifiedBadge from '@/components/VerifiedBadge';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, favouriteProducts, toggleProductFavourite, startConversation, isAuthed, currentUser, offers, makeOffer, respondToOffer, blockUser } = useApp();
  const product = id ? products.find(p => p.id === id) : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const productOffers = offers.filter(o => o.productId === product?.id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-ink-800 mb-2">Product not found</h2>
        <p className="text-ink-500 mb-4">This listing may have been removed or doesn't exist.</p>
        <Link to="/explore" className="text-brand-600 font-semibold">← Back to Explore</Link>
      </div>
    );
  }

  const isFav = favouriteProducts.includes(product.id);
  const similar = products.filter(p => p.id !== product.id && (p.category === product.category || p.sellerId === product.sellerId)).slice(0, 4);
  const sellerProducts = products.filter(p => p.sellerId === product.sellerId && p.id !== product.id).slice(0, 4);

  const handleMessageSeller = async () => {
    if (!isAuthed) {
      navigate('/signin');
      return;
    }
    const convId = await startConversation(product.sellerId, product.id);
    if (convId) navigate(`/messages?c=${convId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-400 mb-5">
        <Link to="/" className="hover:text-ink-600">Home</Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-ink-600">Explore</Link>
        <span>/</span>
        <Link to={`/explore?category=${encodeURIComponent(product.category)}`} className="hover:text-ink-600">{product.category}</Link>
        <span>/</span>
        <span className="text-ink-600 truncate">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-soft border border-ink-100 mb-3">
            <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((activeImage - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
                >
                  <ChevronLeft size={20} className="text-ink-700" />
                </button>
                <button
                  onClick={() => setActiveImage((activeImage + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
                >
                  <ChevronRight size={20} className="text-ink-700" />
                </button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-colors ${activeImage === i ? 'border-brand-600' : 'border-ink-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{product.category}</span>
            <span className="text-xs font-semibold text-ink-500 bg-ink-100 px-3 py-1 rounded-full">{product.condition}</span>
            {product.listingType === 'digital' && (
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">Digital</span>
            )}
            {product.listingType === 'service' && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Service</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-3">{product.title}</h1>

          <p className="text-3xl font-extrabold text-ink-900 mb-4">₹{product.price}</p>

          <p className="text-ink-600 leading-relaxed mb-5">{product.description}</p>

          {/* Quick details */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-ink-50 rounded-xl p-3">
              <p className="text-xs text-ink-400 mb-1 flex items-center gap-1"><MapPin size={12} /> Location</p>
              <p className="text-sm font-semibold text-ink-700">{product.location}</p>
            </div>
            <div className="bg-ink-50 rounded-xl p-3">
              <p className="text-xs text-ink-400 mb-1 flex items-center gap-1"><Package size={12} /> Availability</p>
              <p className="text-sm font-semibold text-ink-700">{product.quantity > 1 ? `${product.quantity} available` : product.quantity === 1 ? 'Last one!' : 'Made to order'}</p>
            </div>
            <div className="bg-ink-50 rounded-xl p-3">
              <p className="text-xs text-ink-400 mb-1 flex items-center gap-1"><Calendar size={12} /> Posted</p>
              <p className="text-sm font-semibold text-ink-700">{new Date(product.postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {product.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-ink-100 text-ink-600 text-xs rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => toggleProductFavourite(product.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold border transition-all ${isFav ? 'bg-error-50 border-error-200 text-error-600' : 'bg-white border-ink-200 text-ink-700 hover:border-error-300'}`}
            >
              <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
              {isFav ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleMessageSeller}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
            >
              <MessageCircle size={20} /> Message Seller
            </button>
            <button className="w-12 h-12 rounded-xl border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-50 transition-colors">
              <Share2 size={18} />
            </button>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-error-500 transition-colors"
          >
            <Flag size={14} /> Report Listing
          </button>

          {/* Offer button */}
          {isAuthed && currentUser?.id !== product.sellerId && (
            <button
              onClick={() => setShowOfferModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-3 border border-accent-200 text-accent-700 rounded-xl text-sm font-semibold hover:bg-accent-50 transition-colors"
            >
              <Tag size={18} /> Make an Offer
            </button>
          )}

          {/* Transaction status */}
          {product.transactionStatus !== 'available' && (
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
              ${product.transactionStatus === 'sold' ? 'bg-ink-100 text-ink-600' : product.transactionStatus === 'reserved' ? 'bg-amber-50 text-amber-700' : 'bg-ink-100 text-ink-600'}"
            >
              {product.transactionStatus === 'sold' ? 'Sold' : product.transactionStatus === 'reserved' ? 'Reserved' : 'Unavailable'}
            </div>
          )}

          {/* Payment disclaimer */}
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              Please note: AMPLOFY does not currently process payments or provide shipping or delivery services. Any payment, shipping, pickup, or exchange arrangement is made directly between the buyer and seller. AMPLOFY does not guarantee or manage these transactions. Please exercise caution and follow our safety guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Seller info */}
      <div className="mt-10 bg-white rounded-2xl shadow-soft border border-ink-100 p-5 sm:p-6">
        <h2 className="font-bold text-ink-800 mb-4">Seller Information</h2>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Link to={`/profile/${product.sellerId}`} className="flex items-center gap-4 group">
            {product.sellerAvatar ? (
              <img src={product.sellerAvatar} alt={product.sellerName} className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
                <Package size={24} className="text-brand-400" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-ink-800 group-hover:text-brand-700 transition-colors">{product.sellerName}</h3>
                {product.sellerVerified && <VerifiedBadge size="md" />}
              </div>
              <p className="text-sm text-ink-400">{product.campus}</p>
            </div>
          </Link>
          <div className="flex gap-2 sm:ml-auto">
            <button
              onClick={handleMessageSeller}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Message
            </button>
            <Link
              to={`/profile/${product.sellerId}`}
              className="px-4 py-2 border border-ink-200 text-ink-700 rounded-xl text-sm font-semibold hover:bg-ink-50 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="font-bold text-xl text-ink-800 mb-4">Reviews</h2>
        <div className="text-center py-12 bg-white rounded-2xl border border-ink-100">
          <p className="text-ink-500">No reviews yet.</p>
        </div>
      </div>

      {/* More from this seller */}
      {sellerProducts.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-ink-800">More from {product.sellerName}</h2>
            <Link to={`/profile/${product.sellerId}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            {sellerProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="mt-10">
          <h2 className="font-bold text-xl text-ink-800 mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            {similar.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowReportModal(false); setReportSubmitted(false); }} />
          <div className="relative bg-white rounded-2xl shadow-float max-w-md w-full p-6 animate-scale-in">
            {reportSubmitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
                  <Check size={28} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-ink-800 mb-1">Thank you. Your report has been submitted for review.</h3>
                <button onClick={() => { setShowReportModal(false); setReportSubmitted(false); }} className="mt-4 px-5 py-2 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700">Close</button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg text-ink-800 mb-2">Report this listing</h3>
                <p className="text-sm text-ink-500 mb-4">Help us keep the marketplace safe. Tell us why you're reporting this listing.</p>
                <div className="space-y-2 mb-4">
                  {['Illegal/prohibited item', 'Scam/fraud', 'Counterfeit item', 'Stolen item', 'Misleading listing', 'Inappropriate content', 'Spam', 'Other'].map(reason => (
                    <label key={reason} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-ink-50 cursor-pointer">
                      <input type="radio" name="reason" value={reason} checked={reportReason === reason} onChange={e => setReportReason(e.target.value)} className="accent-brand-600" />
                      <span className="text-sm text-ink-700">{reason}</span>
                    </label>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Additional details (optional)</label>
                  <textarea value={reportDescription} onChange={e => setReportDescription(e.target.value)} placeholder="Provide more context..." rows={2} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 resize-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowReportModal(false)} className="flex-1 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700">Cancel</button>
                  <button
                    onClick={async () => {
                      if (!currentUser || !reportReason) return;
                      const { error } = await supabase.from('reports').insert({
                        reporter_id: currentUser.id,
                        type: 'listing',
                        target_id: product.id,
                        target_name: product.title,
                        reason: reportReason,
                        description: reportDescription || null,
                        status: 'report-received',
                      });
                      if (!error) setReportSubmitted(true);
                    }}
                    disabled={!reportReason || !currentUser}
                    className="flex-1 py-2.5 bg-error-500 text-white rounded-xl text-sm font-semibold hover:bg-error-600 transition-colors disabled:opacity-50"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Offer modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowOfferModal(false); setOfferSubmitted(false); }} />
          <div className="relative bg-white rounded-2xl shadow-float max-w-md w-full p-6 animate-scale-in">
            {offerSubmitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
                  <Check size={28} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-ink-800 mb-1">Offer submitted!</h3>
                <p className="text-sm text-ink-500">The seller will be notified of your offer of ₹{offerAmount}.</p>
                <p className="text-xs text-ink-400 mt-2">Payments and shipping are arranged directly between students. AMPLOFY does not process or guarantee transactions.</p>
                <button onClick={() => { setShowOfferModal(false); setOfferSubmitted(false); setOfferAmount(''); }} className="mt-4 px-5 py-2 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700">Close</button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg text-ink-800 mb-2">Make an Offer</h3>
                <p className="text-sm text-ink-500 mb-4">Listing price: ₹{product.price}. Enter your offer below.</p>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Your Offer (₹)</label>
                  <input type="number" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder={`e.g. ${Math.round(product.price * 0.8)}`} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-ink-700 mb-1.5">Message (optional)</label>
                  <textarea placeholder="Add a note to the seller..." rows={2} className="w-full bg-ink-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-ink-200 focus:border-brand-300 resize-none" />
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                  <p className="text-xs text-amber-700">If your offer is accepted, payment and exchange must be arranged directly with the seller. AMPLOFY does not process payments.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowOfferModal(false)} className="flex-1 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700">Cancel</button>
                  <button
                    onClick={async () => {
                      if (offerAmount && currentUser && product) {
                        await makeOffer({
                          productId: product.id,
                          buyerId: currentUser.id,
                          buyerName: currentUser.name || 'You',
                          buyerAvatar: currentUser.avatar,
                          amount: Number(offerAmount),
                        });
                        setOfferSubmitted(true);
                      }
                    }}
                    disabled={!offerAmount || Number(offerAmount) <= 0}
                    className="flex-1 py-2.5 bg-accent-600 text-white rounded-xl text-sm font-semibold hover:bg-accent-700 disabled:opacity-50"
                  >
                    Submit Offer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Offers on this product (for seller) */}
      {productOffers.length > 0 && currentUser?.id === product.sellerId && (
        <div className="mt-8">
          <h2 className="font-bold text-xl text-ink-800 mb-4">Offers on this listing</h2>
          <div className="space-y-3">
            {productOffers.map(o => (
              <div key={o.id} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-ink-800">₹{o.amount}</p>
                  <p className="text-xs text-ink-400">From {o.buyerName} · {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                {o.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => respondToOffer(o.id, 'accepted')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100">Accept</button>
                    <button onClick={() => respondToOffer(o.id, 'rejected')} className="px-3 py-1.5 bg-error-50 text-error-600 rounded-lg text-xs font-semibold hover:bg-error-100">Reject</button>
                    <button onClick={() => respondToOffer(o.id, 'countered')} className="px-3 py-1.5 bg-ink-100 text-ink-600 rounded-lg text-xs font-semibold hover:bg-ink-200">Counter</button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ink-100 text-ink-600">{o.status}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
