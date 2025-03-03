import React from "react";
import Image from "next/image";

// Shadcn UI

// Images
import Scandal from "@/assets/images/Scandal.webp";
import LaVie from "@/assets/images/Brand-La-Vie.png";

function FeaturedSection() {
  return (
    <section className="w-full max-[480px]:px-2 max-[860px]:px-4 px-6">
      <div className="w-full min-[300px]:!h-[500px] min-[360px]:!h-[550px] min-[861px]:!h-[450px] min-[1441px]:!h-[500px] flex max-[860px]:flex-col-reverse items-center justify-between bg-[#f5f5f5] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] border border-[#f2f2f2]">
        <div className="max-[860px]:w-full w-1/2 h-full flex max-[860px]:justify-center justify-center">
          <Image
            src={Scandal}
            alt="Logo Scandal"
            className="max-[360px]:h-[200px] max-[460px]:h-[220px] max-[1440px]:h-[300px] w-fit h-[450px] object-contain max-[299px]:mt-[00px] max-[359px]:mt-[70px] max-[460px]:mt-[90px] max-[860px]:mt-7 max-[1440px]:mt-20 mt-6 -mr-12"
          />
          <Image
            src={LaVie}
            alt="Logo La Vie"
            className="max-[360px]:w-[160px] max-[460px]:w-[180px] max-[1440px]:w-[250px] w-[350px] object-contain max-[860px]:mr-10"
          />
        </div>
        <div className="max-[860px]:w-full w-1/2 flex max-[860px]:items-center items-start max-[860px]:justify-center justify-start max-[860px]:pt-12 min-[861px]:ml-10">
          <div className="flex items-center justify-center flex-col gap-2">
            <h2 className="font-semibold uppercase font-serif max-[480px]:text-6xl max-[1440px]:text-8xl text-9xl border-b-2 border-black">
              Brand
            </h2>
            <h2 className="uppercase font-thin max-[480px]:!text-lg max-[1440px]:text-4xl text-5xl tracking-[1.5px]">
              Collection
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedSection;
