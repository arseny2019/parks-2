'use client';
import Link from "next/link";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";

export default function MainSecondBlock({data}) {

    return (
        <>
            {data.secondBlockTitle && <div className="uppercase directions-block-title text-main-black text-[32px] leading-[36px] pt-[100px] font-roboto-condensed
                md:pt-[120px]
                xl:pt-[200px]
            " dangerouslySetInnerHTML={{__html: data.secondBlockTitle}}></div>}
            <div className="mt-20 grid xl:grid-cols-2 gap-6">
                <div className="grid gap-y-6">
                    {data.secondBlockFeatures &&
                        <div className="grid md:grid-cols-2 gap-y-6 gap-x-6">{data.secondBlockFeatures.map((feature) =>
                            <div
                                className="flex flex-col justify-between p-8 h-[160px] md:h-[240px] border border-input-bg-focus-border rounded-3xl"
                                key={feature.title}>
                    <span className="uppercase font-roboto-condensed font-bold
                    text-[28px] leading-[37px]
                    md:text-[36px] md:leading-[47px]
                    ">{feature.title}</span>
                                <span className="font-roboto-condensed text-secondary-black uppercase
                    text-[20px] leading-[26px]">{feature.text}</span>
                            </div>)}</div>}
                    <div className="grid lg:grid-cols-2 xl:block gap-6">
                        {data.secondBlockRegions && <div
                            className="overflow-hidden relative w-full h-[320px] border border-input-bg-focus-border rounded-3xl">
                            <div
                                className="regions-gradient absolute left-0 top-0 z-[1] h-full w-full flex flex-col justify-between items-start p-8">
                                <div className="uppercase font-roboto-condensed
                    text-[28px] leading-[37px]
                    md:text-[36px] md:leading-[47px]" dangerouslySetInnerHTML={{__html: data.secondBlockRegions}}></div>
                                {data.secondBlockRegionsLink &&
                                    <Link className="py-3 px-5 inline-block text-[16px] leading-[150%] font-medium
                                border border-input-bg-focus-border rounded-3xl"
                                          href={data.secondBlockRegionsLink}>Посмотреть</Link>}

                            </div>
                            {data.secondBlockRegionsImage &&
                                <div className="regions-background-map"
                                     style={{backgroundImage: 'url(' + getImageURL(data.secondBlockRegionsImage) + ')'}}/>}
                        </div>}

                        {data.secondBlockAwardsTitle && <div
                            className="text-white overflow-hidden xl:hidden relative w-full h-[320px] md:h-[420px] lg:h-full rounded-3xl">
                            <div
                                className="bg-placeholder-black absolute left-0 top-0 z-[1] h-full w-full flex flex-col justify-between items-start p-8">
                                <div className="uppercase font-roboto-condensed
                    text-[28px] leading-[37px]
                    md:text-[36px] md:leading-[47px]">{data.secondBlockAwardsTitle}</div>
                                <p className="font-roboto-condensed uppercase
                    text-[20px] leading-[26px]">{data.secondBlockAwardsText}</p>
                            </div>
                            {data.secondBlockAwardsImage &&
                                <div className="absolute top-0 left-0 w-full h-full bg-cover"
                                     style={{backgroundImage: 'url(' + getImageURL(data.secondBlockAwardsImage) + ')'}}/>}
                        </div>}
                    </div>
                </div>
                <div className="hidden xl:block">
                    {data.secondBlockAwardsTitle && <div
                        className="text-white overflow-hidden relative min-h-[420px] w-full h-full rounded-3xl">
                        <div
                            className="bg-placeholder-black absolute left-0 top-0 z-[1] h-full w-full flex flex-col justify-between items-start p-8">
                            <div className="uppercase font-roboto-condensed
                    text-[28px] leading-[37px]
                    md:text-[36px] md:leading-[47px]">{data.secondBlockAwardsTitle}</div>
                            <p className="font-roboto-condensed uppercase
                    text-[20px] leading-[26px]">{data.secondBlockAwardsText}</p>
                        </div>
                        {data.secondBlockAwardsImage &&
                            <div className="absolute top-0 left-0 w-full h-full bg-cover"
                                 style={{backgroundImage: 'url(' + getImageURL(data.secondBlockAwardsImage) + ')'}}/>}
                    </div>}
                </div>
            </div>
        </>
    )
}
