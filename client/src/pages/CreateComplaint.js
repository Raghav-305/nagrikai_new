import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    text: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress image before reading
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Reduce image dimensions to max 1200px width
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;
          
          if (width > maxWidth) {
            height = (maxWidth * height) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 80% quality
          const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
          setFormData((prev) => ({ ...prev, image: compressedImage }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.text || !formData.image) {
      setError('Both description and image are required');
      return;
    }

    if (formData.text.length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      await complaintAPI.createComplaint(formData);
      setSuccess('✅ Complaint created successfully! Your ticket ID will be sent shortly.');
      setFormData({ text: '', image: '' });
      setTimeout(() => window.location.href = '/complaints', 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create a new complaint</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Add a clear description and a photo for faster routing and resolution.
            </p>
          </div>

          <div className="card card-interactive p-6 sm:p-8 animate-popIn">
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/30 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Step 1</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">Describe the issue</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Include what, where, and how urgent it is.
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/30 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Step 2</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">Upload a photo</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  A photo helps AI categorize and set priority.
                </div>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-group mb-0">
                <label>Complaint Description</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Describe the problem in detail (minimum 10 characters)…"
                  rows="6"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Be specific for better routing.</span>
                  <span>{formData.text.length}/500</span>
                </div>
              </div>

              <div className="form-group mb-0">
                <label>Upload Photo/Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {formData.image ? (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Preview</div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-[260px] object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300">
                    No photo selected yet.
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-gradient w-full" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit complaint'}
              </button>
            </form>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              Your complaint will be analyzed by AI and assigned a ticket ID.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
