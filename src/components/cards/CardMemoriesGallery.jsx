import React, { useState } from 'react';
import { Camera, Plus, Trash2, X, Calendar, Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import { PenguinsPolaroid } from '../illustrations/PenguinsPolaroid';
import { WashiTape, PinkBow } from '../illustrations/ScrapbookDecorations';
import { playChime, playCutePop } from '../../utils/soundEffects';

export const CardMemoriesGallery = ({ data, onMarkOpened, isOpened, onSavePhotos, showInlineEdit = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photos, setPhotos] = useState(data.photos || []);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Sync photos state whenever data updates from CMS or storage
  React.useEffect(() => {
    if (data?.photos) {
      setPhotos(data.photos);
    }
  }, [data?.photos]);

  // New photo form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleOpen = () => {
    setIsOpen(true);
    playChime();
    onMarkOpened();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setNewImage(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newTitle || !newImage) return;

    const tapes = ['bg-pastel-pink/60', 'bg-pastel-lavender/60', 'bg-pastel-peach/60', 'bg-pastel-blue/60'];
    const rots = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-3'];

    const newPhotoObj = {
      id: `photo-${Date.now()}`,
      title: newTitle,
      date: newDate || 'Special Day',
      caption: newCaption || 'A sweet memory with you ♡',
      image: newImage,
      rotation: rots[photos.length % rots.length],
      tapeColor: tapes[photos.length % tapes.length],
    };

    const updated = [newPhotoObj, ...photos];
    setPhotos(updated);
    if (onSavePhotos) {
      onSavePhotos(updated);
    }

    // Reset form
    setNewTitle('');
    setNewDate('');
    setNewCaption('');
    setNewImage('');
    setIsAddingNew(false);
    playCutePop();
  };

  const handleDeletePhoto = (id, e) => {
    e.stopPropagation();
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    if (onSavePhotos) {
      onSavePhotos(updated);
    }
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null);
    }
    playCutePop();
  };

  return (
    <>
      {/* Scrapbook Card Preview */}
      <div
        onClick={handleOpen}
        className={`group relative bg-white/90 rounded-3xl p-5 sm:p-6 shadow-scrapbook hover:shadow-scrapbook-hover transition-all duration-300 cursor-pointer border-2 border-white/80 flex flex-col items-center text-center transform hover:-translate-y-1.5 ${
          isOpened ? 'ring-2 ring-pastel-lavender/60' : ''
        }`}
      >
        <div className="absolute -top-3">
          <WashiTape color="bg-pastel-lavender/80" pattern="hearts" angle="-rotate-2" />
        </div>

        {isOpened && (
          <span className="absolute top-3 right-3 text-[10px] font-cute px-2 py-0.5 bg-pastel-lavender-soft text-purple-700 rounded-full border border-purple-200">
            {photos.length} Snaps ♡
          </span>
        )}

        <div className="my-2 group-hover:scale-105 transition-transform">
          <PenguinsPolaroid className="w-28 h-28" />
        </div>

        <h3 className="text-xl font-bold font-handwriting text-gray-800 group-hover:text-purple-700 transition-colors mt-2">
          {data.title || "Our Little Memories 📸"}
        </h3>
        <p className="text-xs font-cute text-gray-500 mt-1">
          {data.subtitle || "Snapshots frozen in time"}
        </p>

        <div className="mt-4 flex items-center gap-1 text-xs font-cute text-purple-700 font-semibold">
          <span>Open photo scrapbook</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      {/* Gallery Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-[#FFFDF9] rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-pastel-lavender-soft flex flex-col max-h-[92vh] overflow-y-auto">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <WashiTape color="bg-pastel-lavender/90" pattern="dots" angle="rotate-0" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pastel-lavender/40 mb-4">
              <div className="flex items-center gap-2">
                <PinkBow className="w-6 h-6" />
                <div>
                  <h2 className="text-2xl font-bold font-handwriting text-gray-800">
                    Our Polaroid Memory Book
                  </h2>
                  <p className="text-xs font-cute text-gray-500">
                    Tap any photo to view close-up or add your own pictures ♡
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {showInlineEdit && (
                  <button
                    onClick={() => setIsAddingNew(!isAddingNew)}
                    className="px-3 py-1.5 bg-pastel-lavender text-purple-800 rounded-full font-cute text-xs font-bold hover:bg-pastel-lavender-deep hover:text-white transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add Picture</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    playCutePop();
                    setIsOpen(false);
                    setSelectedPhoto(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-pastel-lavender-soft text-gray-400 hover:text-purple-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add New Photo Form Drawer */}
            {isAddingNew && (
              <form onSubmit={handleAddPhoto} className="mb-6 p-4 bg-purple-50/60 rounded-2xl border-2 border-dashed border-pastel-lavender-deep/40 flex flex-col gap-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-cute font-bold text-purple-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-pastel-pink-deep" /> Add A New Picture to Scrapbook:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-cute text-gray-600">Memory Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Our First Ice Cream Date"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-lavender focus:ring-1 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-cute text-gray-600">Date</label>
                    <input
                      type="text"
                      placeholder="e.g. 14th Feb 2024"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-lavender focus:ring-1 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-cute text-gray-600">Sweet Caption</label>
                  <input
                    type="text"
                    placeholder="e.g. You looked so cute when you laughed..."
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full mt-1 p-2 text-xs font-cute rounded-xl border border-pastel-lavender focus:ring-1 focus:ring-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-cute text-gray-600">Choose Image * (Upload or paste Image URL)</label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    <label className="flex-1 flex items-center justify-center gap-2 p-2 border-2 border-dashed border-pastel-lavender-deep/50 rounded-xl cursor-pointer hover:bg-white text-xs font-cute text-purple-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{newImage ? "Image Selected ✓" : "Upload Picture from Phone / PC"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or paste image web link..."
                      value={newImage.startsWith('data:') ? '' : newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="flex-1 p-2 text-xs font-cute rounded-xl border border-pastel-lavender focus:ring-1 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                {newImage && (
                  <div className="flex items-center gap-3 bg-white p-2 rounded-xl">
                    <img src={newImage} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                    <span className="text-xs font-cute text-gray-500">Preview ready!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="self-end px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-cute text-xs font-bold shadow hover:shadow-md transition-all active:scale-95"
                >
                  Pin into Scrapbook ♡
                </button>
              </form>
            )}

            {/* Polaroid Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
              {photos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    playCutePop();
                    setSelectedPhoto(item);
                  }}
                  className={`group relative bg-white p-3 pb-5 rounded-lg shadow-polaroid hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col transform ${item.rotation} hover:rotate-0 hover:scale-105`}
                >
                  {/* Washi tape over corner */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <WashiTape color={item.tapeColor || 'bg-pastel-pink/70'} pattern="dots" className="w-20 h-5" angle="-rotate-1" />
                  </div>

                  {/* Delete button (subtle) */}
                  {showInlineEdit && (
                    <button
                      onClick={(e) => handleDeletePhoto(item.id, e)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Photo area */}
                  <div className="w-full aspect-square overflow-hidden rounded bg-gray-100 mb-3 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>

                  {/* Polaroid handwritten caption */}
                  <div className="text-center px-1">
                    <h4 className="font-handwriting font-bold text-lg text-gray-800 leading-tight">
                      {item.title}
                    </h4>
                    {item.date && (
                      <span className="text-[10px] font-cute text-pastel-pink-deep block mt-0.5">
                        {item.date}
                      </span>
                    )}
                    <p className="font-handwriting text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {photos.length === 0 && (
              <div className="text-center py-10 font-cute text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto text-pastel-lavender mb-2" />
                <p>No photos yet! Click "Add Picture" above to upload your first memory ♡</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Size Polaroid Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm sm:max-w-md w-full bg-white p-4 pb-6 rounded-2xl shadow-2xl border-4 border-white flex flex-col items-center animate-in zoom-in-95 duration-200"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <WashiTape color="bg-pastel-pink/90" pattern="hearts" angle="rotate-1" />
            </div>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full aspect-square rounded-xl overflow-hidden mt-3 mb-4 shadow-inner">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-handwriting font-bold text-2xl text-gray-800 text-center">
              {selectedPhoto.title}
            </h3>
            {selectedPhoto.date && (
              <span className="text-xs font-cute text-pastel-pink-deep font-semibold mt-1">
                {selectedPhoto.date}
              </span>
            )}
            <p className="font-handwriting text-base text-gray-600 text-center mt-2 px-4 leading-relaxed">
              "{selectedPhoto.caption}"
            </p>
          </div>
        </div>
      )}
    </>
  );
};
