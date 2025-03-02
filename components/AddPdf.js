'use client';

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilePdf } from "react-icons/fa6";
import { LuMoveUpLeft } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function Upload(props) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = React.createRef(); // Ref to the hidden file input

  // Handle file input changes
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };
const router = useRouter();
  
  const BackClick = () => {
    props.setView()
};

  // Remove selected file from the list
  const removeFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // Handle drag-and-drop functionality
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      handleFileChange({ target: { files: droppedFiles } });
    }
  };

  // Allow dropping files on the component
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Trigger the file input click programmatically
  const handleClick = () => {
    fileInputRef.current.click(); // Programmatically trigger the click event
  };

  // Upload files in batches of 10
  const uploadFiles = async () => {
    setUploading(true);
    let batchIndex = 0;
    const batchSize = 10;
    const batches = [];

    // Split files into batches of 10
    while (batchIndex < files.length) {
      const batch = files.slice(batchIndex, batchIndex + batchSize);
      batches.push(batch);
      batchIndex += batchSize;
    }

    try {
      // Upload each batch one by one
      for (const batch of batches) {
        const formData = new FormData();
        batch.forEach((file) => formData.append('file', file));

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (!result.success) {
          toast.error('Upload failed');
          setUploading(false);
          return;
        }
      }

      toast.success(`Upload successful: ${files.length} files`);
      setFiles([])
    } catch (error) {
      toast.error('Error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="absolute w-full z-10 flex justify-start items-center h-screen bg-white flex-col shadow-md">
      
     <div className='w-full absolute top-10 left-10 h-auto p-4'> 
     <div title="Back" onClick={BackClick}
                        className="  bg-[#00B0EF] relative  text-white p-3 rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
                        <LuMoveUpLeft style={{ fontSize: "20px" }} />
          </div>
     </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg flex flex-col justify-start items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-700 mb-4">File Upload</h1>
            
        {/* Upload Area */}
        <div className="flex justify-center shadow-md" style={{ border: '1px solid black', borderStyle: 'dashed', width: '50%', borderRadius: '10px' }}>
          <div
            style={{ width: '100%', maxWidth: '400px', height: '200px' }}
            className="flex justify-center items-center border-4 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick} // Trigger the file input click on area click
          >
            <div className="flex flex-col items-center justify-center text-center p-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-300">PDF</p>
            </div>
            {/* This hidden input allows users to select files when they click the area */}
            <input
              ref={fileInputRef} // Add the ref to the input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept=".pdf"
            />
          </div>
        </div>

        {/* Upload Message */}
        <div className="text-center mt-4">
          {uploading && <p className="text-gray-600">Uploading...</p>}
        </div>

        {/* File List */}
        <div className="p-2 w-full max-w-2xl bg-white rounded-lg flex flex-col justify-center items-center">
          <div className="flex justify-end " style={{ width: '50%' }}>
            <button
              onClick={uploadFiles}
              disabled={files.length === 0 || uploading}
              style={{
                backgroundColor: files.length === 0 || uploading ? '#d1d5db' : '#ffffff',
                color: files.length === 0 || uploading ? '#9ca3af' : '#1e40af', // Gray text for disabled, blue for enabled
                padding: '0.4rem 1.25rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: files.length === 0 || uploading ? 'not-allowed' : 'pointer',
                border: '1px solid',
                borderColor: files.length === 0 || uploading ? '#d1d5db' : '#1e40af',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseOver={(e) => {
                if (files.length > 0 && !uploading) {
                  e.target.style.backgroundColor = '#1e40af';
                  e.target.style.color = '#ffffff';
                }
              }}
              onMouseOut={(e) => {
                if (files.length > 0 && !uploading) {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.color = '#1e40af';
                }
              }}
            >
              Upload
            </button>

          </div>

          <div className="mt-4" style={{ height: '100%', width: '50%' }}>
            {files.length > 0 ? (
              <ul className="list-disc pl-6">
                {files.map((file, index) => (
                  <li key={index} className="text-gray-600 flex justify-between items-center border py-2 px-2 bg-gray-100 mt-2" style={{ borderRadius: '5px' }}>
                    <div className="flex justify-center items-center gap-1">
                      <FaFilePdf className="text-gray-600" style={{ width: '50px' }} />
                      <span className="text-sm" style={{ fontWeight: '500' }}>{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No files selected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
      />
    </div>
  );
}
