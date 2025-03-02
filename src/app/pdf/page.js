"use client";
import React, { useState, useEffect, useRef  } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdMoreVert } from "react-icons/md";
import PDFlist from "../../../components/PDFlist";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "../../../components/Button";
import Image from "next/image";
import { PDFDocument } from 'pdf-lib';
import { FiPrinter } from "react-icons/fi";
import AddPdf from "../../../components/AddPdf";
import { useSearchParams } from "next/navigation";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

function Pdf() {
    const [searchTerm, setSearchTerm] = useState("");
    const [files, setfiles] = useState([])
    // const typingTimeoutRef = useRef(null);
    // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [title, setTilte] = useState('')
    const [pageTexts, setPageTexts] = useState([]);
    const [file, setFiles] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [filteredPages, setFilteredPages] = useState([]);
    const [AddPdF, setAddPdF] = useState(false);
   

    const A4_WIDTH = 800;
    const A4_HEIGHT = A4_WIDTH * 1.414;
    const [zoom, setZoom] = useState(1.0);
    const pdfContainerRef = useRef(null);
    const [state, setState] = useState({ userName: '', password: '' })


    const handleSelectFile = (file) => {
        setTilte(file);
        setFiles(file);
    }

    useEffect(() => {
        if (searchTerm && pageTexts.length > 0) {
            const filtered = pageTexts
                .map((text, index) =>
                    text.toLowerCase().includes(searchTerm.toLowerCase()) ? index + 1 : null
                )
                .filter(Boolean);
            setFilteredPages(filtered);
        } else {
            setFilteredPages([]);
        }
    }, [searchTerm, pageTexts]);

    const onDocumentLoadSuccess = async ({ numPages }) => {
        setNumPages(numPages);
        const pdf = await pdfjs.getDocument(file).promise;
        const texts = await Promise.all(
            Array.from({ length: numPages }, (_, i) => extractPageText(pdf, i + 1))
        );
        console.log(texts, 'texts')
        setPageTexts(texts);
    };



    const highlightSearchTerm = () => {
        if (!searchTerm) {
            // Restore original text if search is cleared
            document.querySelectorAll(".pdf-viewer .react-pdf__Page__textContent span").forEach((span) => {
                const originalText = span.getAttribute("data-original-text");
                if (originalText) {
                    span.innerHTML = originalText;
                }
            });
            return;
        }

        document.querySelectorAll(".pdf-viewer .react-pdf__Page__textContent span").forEach((span) => {
            const originalText = span.getAttribute("data-original-text") || span.textContent;
            span.setAttribute("data-original-text", originalText); // Preserve original text

            const regex = new RegExp(`(${searchTerm})`, "gi");
            if (regex.test(originalText)) {
                span.innerHTML = originalText.replace(
                    regex,
                    `<mark style="background-color: yellow; color: black;">$1</mark>`
                );
            } else {
                span.innerHTML = originalText; // Remove old highlights
            }
        });
    };

    function renameFun(filePath) {
        try {
            return filePath.replace(/^\.\/uploads\//, "")
        } catch (er) {
            return filePath
        }
    }
    const extractPageText = async (pdf, pageNumber) => {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        return textContent.items.map((item) => item.str).join(" ");
    };

    useEffect(() => {
        highlightSearchTerm();
    }, [searchTerm]);

    const handleDownload = async () => {
        if (filteredPages.length === 0) return;

        const existingPdfBytes = await fetch(file).then(res => res.arrayBuffer());
        console.log(existingPdfBytes)
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdf = await PDFDocument.create();

        for (const pageNum of filteredPages) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
            newPdf.addPage(copiedPage);
        }

        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'filtered_pages.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleButtonClick = () => {
        console.log('Fun')
        setAddPdF(!AddPdF);
    };
  
    useEffect(() => {
        const searchParams = window.location.href;
        const cleanedText = searchParams.replace(/^.*\bpdf\?/, "");
        const key = decodeURIComponent(cleanedText)
    console.log(key,'keyyy')
        fetch('/api/files')
            .then((res) => res.json())
            .then(async (data) => {
                if (data.success) {
                    const selectedFiles = [];

                    for (const file of data.files) {
                        try {
                            const pdf = await pdfjs.getDocument(file).promise;
                            const texts = await Promise.all(
                                Array.from({ length: pdf.numPages }, (_, i) => extractPageText(pdf, i + 1))
                            );

                            if (texts.some((text) => text.includes(key))) {
                                selectedFiles.push(file);
                            }
                        } catch (error) {
                            console.error("Error processing PDF:", error);
                        }
                    }
                    setFiles(selectedFiles[0])
                    setTilte(selectedFiles[0])
                    setfiles(selectedFiles)
                    console.log("Selected files:", selectedFiles);
                };

            })
            .catch((error) => console.error('Error fetching files:', error));
    }, []);

    return (<div className="w-full h-screen flex flex-col relative">
        {/* Top Bar */}
        {AddPdF && <AddPdf setView={handleButtonClick} />}
        <div className="w-full h-[80px] flex justify-between items-center shadow-md z-[1] px-4">
            <p className="font-bold">{renameFun(title)}</p>
            <div className="flex items-center space-x-4">
                <p className="text-sm">1/{numPages}</p>
                <div className="flex items-center gap-2">

                    <button title="Zoom Out" onClick={() => setZoom(zoom - 0.1)} className="text-base cursor-pointer">-</button>
                    <p>{Math.round(zoom * 100)}%</p>
                    <button title="Zoom In" onClick={() => setZoom(zoom + 0.1)} className="text-base cursor-pointer">+</button>
                </div>
                <div className="flex items-center gap-2">
                    <IoShareSocialOutline className="cursor-pointer" title="Share" />
                    <MdOutlineFileDownload className="cursor-pointer" title="Download" />
                    <FiPrinter className="cursor-pointer" title="Print" />
                    <MdMoreVert className="cursor-pointer" title="More" />
                </div>
            </div>
            <p className="text-sm">
                <Image
                    src="/Images/OrimartLogo.jpg"
                    alt="Brand Logo"
                    width={140}
                    height={0}
                    className="w-[120px] md:w-[100px]" />
            </p>
        </div>


        {/* Main Layout */}
        <div className="w-full flex flex-grow overflow-hidden relative">

            {/* Left Sidebar */}

            <div className="w-[20%] h-full flex flex-col p-2">
                <div className="w-full h-8 border ">
                    <input
                        placeholder="Search here"
                        className="w-full h-full outline-none px-2"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full flex justify-between mt-2 relative">
                    <p className="text-gray-500 text-sm">Document</p>
                    <div className="bg-sky-500 w-[20px] text-center absolute -right-2" style={{ borderRadius: '50%' }}> <p className="cursor-pointer text-sm font-bold text-white text-base" title="Add PDF" onClick={handleButtonClick}>+</p></div>
                </div>
                <div className="mt-2 flex-grow overflow-y-auto scrollbar-hide">
                    <PDFlist files={files} setFiles={handleSelectFile} layout="vertical" />
                </div>
            </div>

            {/* Center PDF Viewer */}
            <div className="w-[60%] h-full flex flex-col items-center overflow-y-auto scrollbar-hide">
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    {numPages &&
                        Array.from({ length: numPages }, (_, i) => (
                            <div key={i} className="text-center ">
                                <Page pageNumber={i + 1} width={A4_WIDTH} height={A4_HEIGHT} scale={zoom} />
                                <p>Page {i + 1}</p>
                            </div>
                        ))}
                </Document>
            </div>

            {/* Right Sidebar */}
            <div className="w-[20%] h-full flex flex-col items-center p-4 bg-gray-200 gap-2 relative">
                <p className="text-gray-500 text-sm text-left w-full">Filtered File</p>
                <div className="w-full bg-gray-100 flex flex-col items-center p-4 border-l border-gray-300 overflow-y-auto">
                    <Button onclick={handleDownload} Name="Download" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" />
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        {filteredPages.length > 0 ? (
                            filteredPages.map((pageNum) => (
                                <div key={pageNum} className="my-2">
                                    <Page pageNumber={pageNum} width={100} scale={2} />
                                    <p>Page {pageNum}</p>
                                </div>
                            ))
                        ) : (
                            <p>No results</p>
                        )}
                    </Document>
                </div>

                <div className="hidden absolute w-[300px] items-center h-screen bg-white -top-4 z-5">
                    <div className="mt-[100px] " style={{ width: '90%' }}>
                        <h1 className="text-sky-500 font-bold text-center">Login To Download</h1>
                        <div>
                            <input type="text" name="UserName" className="border w-full h-10 mt-4" placeholder="userName" style={{
                                padding: '0.4rem 1.25rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                border: '1px solid',
                                borderColor: '#d1d5db',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                outline: 'none'
                            }} />
                            <input type="password" name="Password" className="border w-full h-10 mt-4" placeholder="Password" style={{
                                padding: '0.4rem 1.25rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                border: '1px solid',
                                borderColor: '#d1d5db',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                outline: 'none'
                            }} />
                            <p className="mt-4 text-end text-sm text-sky-500 underline cursor-pointer">Sign up?</p>
                            <button className="border w-full h-10 mt-4" style={{
                                backgroundColor: (!state.userName && !state.password) ? '#d1d5db' : '#ffffff',
                                color: (!state.userName && !state.password) ? '#9ca3af' : '#1e40af', // Gray text for disabled, blue for enabled
                                padding: '0.4rem 1.25rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                cursor: (!state.userName && !state.password) ? 'not-allowed' : 'pointer',
                                border: '1px solid',
                                borderColor: (!state.userName && !state.password) ? '#d1d5db' : '#1e40af',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                            }}
                                onMouseOver={(e) => {
                                    if ((state.userName && state.password)) {
                                        e.target.style.backgroundColor = '#1e40af';
                                        e.target.style.color = '#ffffff';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if ((state.userName && state.password)) {
                                        e.target.style.backgroundColor = '#ffffff';
                                        e.target.style.color = '#1e40af';
                                    }
                                }}>Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Pdf;
