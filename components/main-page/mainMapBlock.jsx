import Image from "next/image";
import Link from "next/link";
import {getImageURL} from "@/helpers/directus";

const MainMapBlock = ({mapBlockText, mapBlockLink, mapBlockImage}) => {

    return (
        <div className="relative border-b-[1px] bg-black border-[rgba(255,_255,_255,_0.06)]">
            <div className="c-container flex items-center justify-center map-background text-white
                h-[580px] py-[120px]
                sm:h-[700px]
                md:h-[860px] md:py-[190px]
                "
                 style={{backgroundImage: 'url(' + getImageURL(mapBlockImage) + ')'}}
            >
                <div className="absolute left-0 top-0 w-full h-full upper-gradient"></div>
                <div className="h-full z-[5] flex flex-col items-center justify-between max-w-[700px]">
                    <Image quality={100} width={220} height={65}
                           src="/logo-green.svg"
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
