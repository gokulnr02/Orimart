import React, { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoMdCloseCircleOutline } from "react-icons/io";

function AddPdf() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Handle File Selection
    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        addFiles(newFiles);
    };

    // Drag & Drop Functionality
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const newFiles = Array.from(event.dataTransfer.files);
        addFiles(newFiles);
    };

    // Add Files to List
    const addFiles = (newFiles) => {
        const validFiles = newFiles.filter(file => file.type === "application/pdf");
        if (validFiles.length === 0) {
            alert("Only PDF files are allowed.");
            return;
        }
        setSelectedFiles((prev) => [...prev, ...validFiles]);
    };

    // Remove File
    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Upload Files

    const [progress, setProgress] = useState({});

const handleUpload = async () => {
    if (selectedFiles.length === 0) {
        alert("Please select at least one PDF file to upload.");
        return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("pdfFiles", file));

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload-pdf", true);

        // Track Upload Progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgress((prev) => ({ ...prev, [file.name]: percent }));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                alert("Files uploaded successfully!");
                setSelectedFiles([]);
                setProgress({}); // Reset progress
            } else {
                alert("File upload failed!");
            }
        };

        xhr.onerror = () => alert("An error occurred while uploading files.");
        xhr.send(formData);
    } catch (error) {
        console.error("Upload Error:", error);
        alert("An error occurred while uploading files.");
    }
};


    return (
        <div className="absolute w-full h-screen z-10 flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg flex flex-col p-6 border rounded-lg" style={{ width: '65%', height: '550px' }}>
                <div className="border-b p-4">
                    <h2 className="text-xl font-semibold">File Upload</h2>
                </div>
                <div className="w-full flex flex-grow mt-4">

                    {/* File Upload Section with Drag & Drop */}
                    <div
                        className="flex justify-center items-center border p-4 bg-gray-100"
                        style={{ width: '40%', borderStyle: 'dashed', borderColor: 'gray' }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-gray-600" style={{ color: 'gray' }}>Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-400">PDF only</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} multiple />
                        </label>
                    </div>

                    {/* Right Section: File List */}
                    <div className="w-1/2 flex flex-col justify-between items-center p-4">
                        <div className="w-full flex flex-col items-center justify-center gap-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex flex-col w-full border p-2 rounded-lg bg-gray-50 shadow-sm" style={{ width: '500px' }}>
                                    {/* File Info Row */}
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <FaRegFilePdf className="text-red-500" style={{ width: '25px', height: '25px' }} />
                                            <p className="text-sm">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                                        </div>
                                        <IoMdCloseCircleOutline
                                            className="cursor-pointer text-gray-500 hover:text-red-500"
                                            style={{ width: '20px', height: '20px' }}
                                            onClick={() => removeFile(index)}
                                        />
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                                            style={{ width: `${progress[index] || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* Upload Button */}
                        <div className="w-full flex justify-end mt-4">
                            <button onClick={handleUpload} className="border p-2 flex justify-center items-center rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105" style={{ width: '100px', height: '40px' }}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPdf;
