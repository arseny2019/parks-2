import Image from "next/image";
import Link from "next/link";

const MainMapBlock = ({mapBlockText, mapBlockLink}) => {

    return (
        <div className="relative map-gradient border-b-[1px] border-[rgba(255,_255,_255,_0.06)]">
            <div className="c-container flex items-center justify-center map-background text-white
                h-[640px]
                sm:h-[700px]
                md:h-[580px]
                lg:h-[660px]
                xl:h-[860px]
                ">
                <div className="absolute left-0 top-0 w-full h-full upper-gradient"></div>
                <div className="z-[5] flex flex-col items-center max-w-[700px]">
                    <Image quality={100} className="lg:w-[320px] lg:h-[65px]" width={246} height={50}
                           src="/logo-blue.svg"
                           alt="Общероссийская общественная организация Парки России"></Image>
                    <div className="flex flex-col items-center mt-20">
                        <p className="text-[16px] leading-6 font-inter text-center
                        lg:text-[18px] lg:leading-[27px]
                        xl:text-[20px] xl:leading-[30px]
                        ">{mapBlockText}</p>
                        <Link
                            className="rounded-[28px] bg-white text-main-black mt-8 px-6 py-4 text-[16px] leading-6 font-[500]"
                            target="_blank" href={mapBlockLink || ''}>Перейти на сайт</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainMapBlock;
