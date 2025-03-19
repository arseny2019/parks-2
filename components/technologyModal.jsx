'use client';
import {getImageURL} from "@/helpers/directus";
import Image from "next/image";
import {useRef} from "react";
import Link from "next/link";

const TechnologyModal = ({technology}) => {
    const overlay = useRef(null);
    const modalRef = useRef(null);

    const closeModal = () => {
        overlay?.current.classList.add('opacity-0', 'invisible');
        modalRef?.current.classList.add('translate-x-[100%]');
        document.body.classList.remove('menu-open');
    }

    return (
        <>
            <div onClick={() => closeModal()} ref={overlay}
                 className="duration-300 modal-overlay invisible opacity-0 z-[98] fixed right-0 top-0 w-full h-full bg-[rgba(10,_10,_10,_0.5)]"></div>
            <div ref={modalRef}
                 className="duration-300 modal-container translate-x-[100%] z-[99] fixed right-0 top-0 w-full h-full max-w-[1000px] bg-white
                py-12 px-4
                md:px-8
                lg:py-[80px] lg:px-[50px] overflow-y-auto">
                <div onClick={() => closeModal()}
                     className="opacity-40 duration-200 hover:opacity-100 cursor-pointer absolute right-4 top-4 w-[40px] h-[40px]">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M19.5002 18.5859L12.0753 11.1611L10.6611 12.5753L18.0859 20.0002L10.6613 27.4248L12.0755 28.839L19.5002 21.4144L26.9246 28.8388L28.3388 27.4246L20.9144 20.0002L28.339 12.5756L26.9247 11.1613L19.5002 18.5859Z"
                              fill="#0A0A0A"/>
                    </svg>
                </div>
                <div>
                    <h3 className="font-roboto-condensed font-bold uppercase pr-8
                    text-[28px] leading-[34px]
                    lg:text-[36px] lg:leading-[43px]
                    xl:text-[40px] xl:leading-[48px]
                ">{technology.title}</h3>
                    {technology.content && <div className="mt-10 text-[18px] leading-[27px] news-content"
                                                dangerouslySetInnerHTML={{__html: technology.content}}></div>}
                    {technology.features && technology.features.length > 0 &&
                        <div className="grid mt-10 grid-cols-1 gap-y-6">
                            {technology.features.map(feature => (
                                <div key={feature.title || feature.description} className="custom-list-item custom-list-item_modal flex flex-col
                                gap-y-2
                                md:pr-8
                            ">
                                    {feature.title && <p className="font-[500]
                                    text-[18px] leading-[27px]
                                ">{feature.title}</p>}
                                    {feature.description && <p className="text-secondary-black
                                    text-[16px] leading-6
                                ">
                                        {feature.description}
                                    </p>}
                                    {feature.link && <div><Link
                                        className="font-roboto font-[600] text-main-blue
                                        text-[16px] leading-6 hover:opacity-80
                                    "
                                        href={feature.link || ''}>Подробнее</Link></div>}
                                </div>
                            ))}
                        </div>}
                    {technology.gallery && technology.gallery.length > 0 &&
                        <div className="mt-8 lg:mt-10 grid grid-cols-1 gap-y-6"
                        >{technology.gallery.map((image, index) => <div key={technology.title + index}><Image
                            quality={100}
                            width={900}
                            height={0}
                            alt={technology.title}
                            src={getImageURL(image.directus_files_id)}
                            className="w-full object-cover rounded-[1rem]"
                        ></Image></div>)}</div>}
                </div>
            </div>
        </>
    )
}

export default TechnologyModal;
