"use client";

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateImage } from '@/utils/actions';

// Purpose: Generate the image based on the search term 
// Functions: Save and edit the image & title 

const GenerateImagePage = () => {
  const [search, setSearch] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<{ title: string, url: string }[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // perform the image generation 
    const response = await generateImage(search);
    if (response) {
      setImageUrl(response);
    } else {
      setError('Failed to generate image. Please try again.');
    }
    setLoading(false);
  };

  // save the generated image 
  const saveImage = () => {
    if (imageUrl) {
      const newImage = { title: search, url: imageUrl };
      setSavedImages([...savedImages, newImage]);
      setImageUrl(null);
      setSearch('');
      toast.success("Image saved successfully!", { autoClose: 500 });
    }
  };

  // delete image 
  const deleteImage = (index: number) => {
    const updatedImages = savedImages.filter((_, i) => i !== index);
    setSavedImages(updatedImages);
    toast.info("Image deleted successfully!", { autoClose: 500 });
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditTitle(savedImages[index].title);
  };

  const handleSaveEdit = (index: number) => {
    const updatedImages = [...savedImages];
    updatedImages[index].title = editTitle;
    setSavedImages(updatedImages);
    setEditIndex(null);
    setEditTitle('');
    toast.success("Title updated successfully!", { autoClose: 500 });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Head>
        <title>Image Generation</title>
      </Head>
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Generate Search Image</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter search term"
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Generating... 📸' : 'Generate Image'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {imageUrl && (
        <div className="mt-6 flex flex-col items-center">
          <img src={imageUrl} alt="Generated Tour" className="w-64 h-64 object-cover rounded shadow-md" />
          <button
            onClick={saveImage}
            className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Save Image
          </button>
        </div>
      )}
      {savedImages.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Saved Images</h2>
          <ul>
            {savedImages.map((image, index) => (
              <li key={index} className="mb-4 flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow-md">
                <div className="flex items-center">
                  <img src={image.url} alt={image.title} className="w-16 h-16 object-cover rounded mr-4" />
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-32 p-1 border rounded dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <span className="text-gray-900 dark:text-white">{image.title}</span>
                  )}
                </div>
                <div className="flex items-center">
                  {editIndex === index ? (
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteImage(index)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GenerateImagePage;
