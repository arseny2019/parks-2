'use client';
import {useState} from "react";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import Link from "next/link";
import ContactModal from "@/components/contactModal";

export default function ProjectDetailContent({detail}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div id="offsetBlock"></div>
            <div className="c-container
                mt-[100px] pb-[100px]
                md:mt-[120px] md:pb-[120px]
                xl:mt-[150px] xl:pb-[150px]
                2xl:mt-[200px] 2xl:pb-[200px]
            ">
                <div className="flex flex-col
                    gap-y-[80px]
                    sm:gap-y-[100px]
                    xl:gap-y-[120px]
                    2xl:gap-y-[150px]
                ">
                    {detail.mainText && <h2 className="font-[400] font-roboto
                        text-[22px] leading-[33px]
                        sm:text-[24px] sm:leading-[36px]
                        lg:text-[36px] lg:leading-[54px]
                        xl:text-[40px] xl:leading-[60px]
                        2xl:text-[48px] 2xl:leading-[72px]
                    ">{detail.mainText}</h2>}
                    {detail.features && detail.features.length > 0 && <div>
                        {detail.features_title && <h4 className="font-bold font-roboto-condensed uppercase
                        text-[24px] leading-[36px] mb-8
                        lg:text-[30px] lg:leading-[45px] lg:mb-16
                        ">{detail.features_title}</h4>}
                        <div className="grid
                        grid-cols-1 gap-y-[40px]
                        md:grid-cols-2 md:gap-x-6 md:gap-y-[48px]
                        xl:gap-y-[80px]
                        ">
                            {detail.features.map(feature => (
                                <div key={feature.title || feature.description} className="custom-list-item flex flex-col
                                gap-y-[6px]
                                sm:gap-y-2
                                md:gap-y-3 md:pr-8
                            ">
                                    {feature.title && <p className="font-[500]
                                    text-[18px] leading-[27px]
                                    xl:text-[22px] xl:leading-[33px]
                                ">{feature.title}</p>}
                                    {feature.description && <p className="text-secondary-black
                                    text-[16px] leading-6
                                    md:text-[18px] md:leading-[27px]
                                ">
                                        {feature.description}
                                    </p>}
                                    {feature.link && <div><Link
                                        className="font-roboto font-[600] text-main-green
                                        text-[16px] leading-6
                                        md:text-[18px] md:leading-[27px] hover:opacity-80
                                    "
                                        href={feature.link}>Подробнее</Link></div>}
                                </div>
                            ))}
                        </div>
                    </div>}

                    {detail.gallery && detail.gallery.length > 0 &&
                        <div className="grid grid-cols-1 gap-y-8 md:gap-y-10">
                            {detail.gallery.map(item => {
                                if (item.type && item.type.includes('image')) {
                                    return <Image
                                        quality={100}
                                        key={item.directus_files_id}
                                        className="w-full aspect-[2] rounded-3xl object-cover"
                                        width={900} height={0} src={getImageURL(item.directus_files_id)}
                                        alt="Изображение из галереи"/>
                                } else if (item.type && item.type.includes('video')) {
                                    return <video loop={true} muted={true} width={1360} height={0}
                                                  key={item.directus_files_id}
                                                  className="rounded-[16px] w-full h-full object-cover" controls={true}
                                                  autoPlay={false}>
                                        <source src={getImageURL(item.directus_files_id) + '#t=0.001'}/>
                                    </video>
                                } else {
                                    // Fallback for items without type or unknown type
                                    return <Image
                                        quality={100}
                                        key={item.directus_files_id}
                                        className="w-full aspect-[2] rounded-3xl object-cover"
                                        width={900} height={0} src={getImageURL(item.directus_files_id)}
                                        alt="Изображение из галереи"/>
                                }
                            })}
                        </div>}

                    {detail.video_2 && <video loop={true} muted={true} width={1360} height={0}
                                              className="rounded-[16px] w-full h-full object-cover" controls={true}
                                              autoPlay={false}>
                        <source src={getImageURL(detail.video_2) + '#t=0.001'}/>
                        <source src={getImageURL(detail.video_2_mp4) + '#t=0.001'}/>
                    </video>}

                    <button onClick={openModal} className="block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                       py-[30px] text-[20px] leading-[150%] rounded-[45px]
                       lg:py-[40px] lg:text-[22px] lg:rounded-[57px]
                    ">Связаться с нами</button>
                </div>
            </div>
            <ContactModal project_title={detail.detailTitle} active={isModalOpen} closeModalCallback={closeModal} />
        </>
    );
}
