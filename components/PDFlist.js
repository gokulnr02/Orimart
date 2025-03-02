"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Document, Page } from "react-pdf";


function PDFlist({ files, setFiles }) {
  const scrollRef = useRef(null);
  const router = useRouter();

  const BrandClick = () => {
    // router.push("/Brand");
  };

  console.log(files,'files')
  return (
      <div
        className="h-screen overflow-y-auto  flex flex-col items-center no-scrollbar gap-4"
          ref={scrollRef}
        >

          {files.length > 0 &&  files.map((file, index) => (
            <div key={index} className="h-auto w-full flex justify-center items-center">
              <div
                onClick={BrandClick}
                className="w-[200px] h-full flex flex-col justify-start items-start cursor-pointer "
              >
                <div
                  onClick={() => setFiles(file)}
                  style={{ cursor: "pointer" }}
                  className="w-full h-full flex justify-center items-center CardShadowStyle"
                >
                  <Document file={file}>
                    <Page pageNumber={1} width={100} scale={2} />
                  </Document>
                </div>
              </div>
            </div>
          ))}
        </div>
  
  );
}

export default PDFlist;
