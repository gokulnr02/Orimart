"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "../components/Button";
import { PDFDocument } from 'pdf-lib';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PDFlist from "../components/PDFlist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const A4_WIDTH = 800;
const A4_HEIGHT = A4_WIDTH * 1.414;

export default function PdfViewer() {
    const [numPages, setNumPages] = useState(null);
    const [pageTexts, setPageTexts] = useState([]);
    const [filteredPages, setFilteredPages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const typingTimeoutRef = useRef(null);
    const [file, setFile] = useState("hardware.pdf"); 
    const files = ["hardware.pdf", "/shilage champering tool.pdf", "/Opus Banding Tool.pdf"];

    const extractPageText = async (pdf, pageNumber) => {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        return textContent.items.map((item) => item.str).join(" ");
    };

    useEffect(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
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
        }, 500);

        return () => clearTimeout(typingTimeoutRef.current);
    }, [searchTerm, pageTexts]);

    const onDocumentLoadSuccess = async ({ numPages }) => {
        setNumPages(numPages);
        const pdf = await pdfjs.getDocument(file).promise;
        const texts = await Promise.all(
            Array.from({ length: numPages }, (_, i) => extractPageText(pdf, i + 1))
        );
        setPageTexts(texts);
    };

    const handleDownload = async () => {
        if (filteredPages.length === 0) return;
        
        const existingPdfBytes = await fetch(file).then(res => res.arrayBuffer());
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

    const handleSelectFile = (selectedFile) => {
        setFile(selectedFile);
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/5 bg-gray-100 flex flex-col items-center p-4">
                <h2 className="text-lg font-semibold">PDF List</h2>
                <PDFlist files={files} setFiles={handleSelectFile} layout="vertical" />
            </div>
            <div className="w-3/5 flex flex-col items-center p-4 overflow-y-auto">
                <input
                    placeholder="Search here"
                    className="w-full p-2 text-lg border border-gray-300 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    {numPages &&
                        Array.from({ length: numPages }, (_, i) => (
                            <div key={i} className="text-center my-2">
                                <Page pageNumber={i + 1} width={A4_WIDTH} height={A4_HEIGHT} />
                                <p>Page {i + 1}</p>
                            </div>
                        ))}
                </Document>
            </div>
            <div className="w-1/5 bg-gray-100 flex flex-col items-center p-4 border-l border-gray-300 overflow-y-auto">
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
    );
}