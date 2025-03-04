"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import PDFlist from '../../components/PDFlist';
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument } from 'pdf-lib';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const images = [
  "/Images/Tool1.jpg",
  "/Images/Tool2.jpg"
];

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const brandCards = [
  { img: "/Images/CardImg1.jpg", label: "Orient Hardware" },
  { img: "/Images/CardImg2.jpg", label: "Orient Machinery" },
  { img: "/Images/CardImg3.jpg", label: "Kency" },
  { img: "/Images/CardImg4.jpg", label: "Rex" },
  { img: "/Images/CardImg5.jpg", label: "Red Razor" }
];

export default function ImageSlider() {

  const router = useRouter();

  const BrandClick = () => {
    router.push('/Brand');
  };

  useEffect(() => {
    const swiperInstance = document.querySelector(".swiper")?.swiper;
    if (swiperInstance) {
      swiperInstance.params.navigation.prevEl = ".custom-prev";
      swiperInstance.params.navigation.nextEl = ".custom-next";
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, []);

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 200;
    }
  };

  return (
    <div className="w-full h-auto p-6">
      <div className="w-full h-auto flex justify-center items-center">
        <Image
          src="/Images/OrimartLogo.jpg"
          alt="Brand Logo"
          width={140}
          height={0}
          className="w-[120px] md:w-[140px]"
        />
      </div>

      <div className="relative w-full h-[400px] mt-6">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt="slider" className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="custom-prev absolute left-5 top-1/2 -translate-y-1/2 bg-[#00B0EF] text-white p-3 rounded-full z-10">
          <FaChevronLeft />
        </button>

        <button className="custom-next absolute right-5 top-1/2 -translate-y-1/2 bg-[#00B0EF] text-white p-3 rounded-full z-10">
          <FaChevronRight />
        </button>
      </div>

      <div className="mt-20 mb-10">
        <p className="text-[30px] w-full text-center font-semibold">OUR BRAND</p>
        <div className="w-full h-auto pt-10 flex justify-center items-center gap-4">
          <button
            className="w-[4%] h-auto flex justify-center items-center"
            onClick={scrollLeft}
          >
            <GoChevronLeft style={{ fontSize: "36px", color: "#4b4b4b" }} />
          </button>

          <div
            ref={scrollRef}
            className="w-[92%] h-auto flex justify-center items-center gap-8 overflow-x-auto scroll-smooth BrandCardScroll"
          >
            {brandCards.map((item, index) => (
              <div
                key={index} onClick={BrandClick}
                className="w-[200px] h-[250px] flex flex-col justify-start items-start cursor-pointer CardShadowStyle"
              >
                <div className="h-[75%] w-full">
                  <Image
                    src={item.img}
                    alt="Card Img"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-[25%] w-full flex justify-center items-center bg-[#00B0EF]">
                  <span className="text-[14px]">{item.label}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="w-[4%] h-auto flex justify-center items-center"
            onClick={scrollRight}
          >
            <GoChevronRight style={{ fontSize: "36px", color: "#4b4b4b" }} />
          </button>
        </div></div>


    </div>
  );
}
