'use client';
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import {useEffect, useRef, useState} from "react";

export default function ProjectTopBlock({detail}) {
    const videoRef = useRef(null);
    const [video, setVideo] = useState(null);
    const [videoMP4, setVideoMP4] = useState(null);

    useEffect(() => {
        if (detail.video) {
            setVideo(getImageURL(detail.video));
        }
        if (detail.videoMP4) {
            setVideoMP4(getImageURL(detail.videoMP4));
        }
    }, [detail]);

    return (
        <>
            <div className="relative h-[600px] xl:h-[750px]">
                <div className="h-full w-full absolute left-0 top-0 z-[1] dark-gradient">
                    <div className="h-full c-container flex flex-col justify-end">
                        <div className="
                            pr-[56px] pb-[64px]
                            md:pr-10
                            lg:pr-[110px] lg:pb-[80px]
                            2xl:pr-0 2xl:pb-[90px]
                        ">
                            <h1 className="font-roboto-condensed text-white font-[600] uppercase
                                text-[36px] leading-[40px]
                                md:text-[50px] md:leading-[55px]
                                lg:text-[60px] lg:leading-[66px]
                                xl:text-[70px] xl:leading-[77px]
                                2xl:text-[80px] 2xl:leading-[88px]
                            ">{detail.detailTitle || detail.title}</h1>
                            <h4 className="font-roboto-condensed text-white font-[600] uppercase opacity-80
                                text-[24px] leading-[28px] mt-3
                                md:text-[32px] md:leading-[36px]
                                lg:text-[36px] lg:leading-[40px] lg:mt-5
                                xl:text-[40px] xl:leading-[44px]
                                2xl:text-[50px] 2xl:leading-[55px]
                            ">{detail.subtitle}</h4>
                        </div>
                    </div>
                </div>
                {!(video || videoMP4) &&
                    <Image quality={100} width={1320} height={0} className="w-full h-full object-cover"
                           src={getImageURL(detail.image)}
                           alt={detail.title}></Image>}
                {(video || videoMP4) && <video loop={true} ref={videoRef} muted={true} width={1360} height={0}
                                               className="absolute top-0 left-0 w-full h-full object-cover"
                                               playsInline={true} autoPlay={true}
                                               poster={detail.image}>
                    <source src={video}/>
                    <source src={videoMP4}/>
                </video>}
            </div>
        </>
    )
}
