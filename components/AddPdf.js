import React from "react";

function AddPdf() {
    return (
        <div className="absolute w-full h-screen z-10 flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg flex flex-col p-6 border rounded-lg" style={{ width: '65%', height: '550px' }}>
                <div className="border-b p-4">
                    <h2 className="text-xl font-semibold">File Upload</h2>
                </div>
                <div className="w-full flex flex-grow mt-4">
                    {/* File Upload Section */}
                    <div className="flex justify-center items-center border p-4 bg-gray-100" style={{ width: '40%', borderStyle: 'dashed' }}>
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div>

                    {/* Left Section */}
                    <div className="w-1/2 flex flex-col justify-between items-center p-4">
                        <div className="w-full flex flex-col items-center justify-center gap-2">
                            {/* <p className="text-lg font-medium text-gray-700">Additional Content</p> */}
                            <div className="h-[100px] w-full flex items-center border" style={{width:'500px',height:'50px'}}>pdf</div>
                            <div className="h-[100px] w-full flex items-center border" style={{width:'500px',height:'50px'}}>pdf</div>
                            <div className="h-[100px] w-full flex items-center border" style={{width:'500px',height:'50px'}}>pdf</div>
                        </div>

                        {/* Button Section */}
                        <div className="w-full flex justify-end mt-4">
                            <button className="border p-2 flex justify-center items-center rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105" style={{ width: '100px', height: '40px' }}>
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
