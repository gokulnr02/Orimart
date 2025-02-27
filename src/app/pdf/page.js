"use client";
import React, { useState, useRef, useEffect } from "react";
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
import AddPdf from "../../../components/AddPdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

function Pdf() {
    const [searchTerm, setSearchTerm] = useState("");
    const files = ["hardware.pdf", "/shilage champering tool.pdf", "/Opus Banding Tool.pdf"]
    // const typingTimeoutRef = useRef(null);
    // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [pageTexts, setPageTexts] = useState([]);
    const [file, setFiles] = useState("hardware.pdf");
    const [numPages, setNumPages] = useState(null);
    const [filteredPages, setFilteredPages] = useState([]);
    const [AddPdF,setAddPdF] = useState(false)
    console.log(AddPdF,'AddPdF')

    const A4_WIDTH = 800;
    const A4_HEIGHT = A4_WIDTH * 1.414;


    const handleSelectFile = (file) => {
        setFiles(file);
    }
    // useEffect(() => {
    //     if (typingTimeoutRef.current) {
    //         clearTimeout(typingTimeoutRef.current);
    //     }
    //     typingTimeoutRef.current = setTimeout(() => {
    //         setDebouncedSearchTerm(searchTerm);
    //     }, 500);

    //     return () => clearTimeout(typingTimeoutRef.current);
    // }, [searchTerm]);

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

    return (<div className="w-full h-screen flex flex-col relative">
        {/* Top Bar */}
       {AddPdF && <AddPdf />}
        <div className="w-full h-[calc(10vh+80px)] flex justify-between items-center shadow-md z-[1] px-4">
            <p className="font-bold">Pdf title</p>
            <div className="flex items-center space-x-4">
                <p className="text-sm">1/16</p>
                <div className="flex items-center gap-2">
                    <button className="text-base cursor-pointer">-</button>
                    <p>100%</p>
                    <button className="text-base cursor-pointer">+</button>
                </div>
                <div className="flex items-center gap-2">
                    <IoShareSocialOutline className="cursor-pointer" />
                    <MdOutlineFileDownload className="cursor-pointer" />
                    <MdMoreVert className="cursor-pointer" />
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
                <div className="w-full flex justify-between mt-2">
                    <p className="text-gray-500 text-sm">Document</p>
                    <p className="cursor-pointer text-sm font-bold" onClick={handleButtonClick}>+</p>
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
                                <Page pageNumber={i + 1} width={A4_WIDTH} height={A4_HEIGHT} />
                                <p>Page {i + 1}</p>
                            </div>
                        ))}
                </Document>
            </div>

            {/* Right Sidebar */}
            <div className="w-[20%] h-full flex flex-col items-center p-4 bg-gray-200 gap-2">
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
            </div>
        </div>
    </div>
    );
}

export default Pdf;
