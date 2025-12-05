'use client';
import Link from "next/link";
import InteractiveMap from "@/components/regions/interactiveMap";
import {useEffect, useRef, useState} from "react";

export default function RegionsComponent({archivePageData, regionGroups, regions}) {
    const [filteredData, setFilteredData] = useState(regionGroups);
    const [filteredRegions, setFilteredRegions] = useState(null);
    const [filterStr, setFilterStr] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (filterStr) {
            let cloned = JSON.parse(JSON.stringify(regionGroups)).map(group => {
                group.regions = group.regions.filter(region => {
                    return region.regionName.toLowerCase().includes(filterStr.toLowerCase());});
                return group;
            });
            setFilteredData(cloned);
        } else {
            setFilteredData(regionGroups);
        }
    }, [filterStr]);

    useEffect(() => {
        console.log('regions', regions);
        setFilteredRegions(regions.filter(region => region.regionGroup));
    }, [])

    return(
        <>
            <div className="map-scroll-container c-container w-full
            mt-16
            lg:mt-20
            2xl:mt-[100px]
            overflow-y-auto no-scrollbar
            ">
                <InteractiveMap regions={filteredRegions}/>
            </div>
            <div className="c-container mt-20 md:mt-[120px] xl:mt-[150px] pb-[120px] xl:pb-[200px]">
                <div className="font-roboto-condensed text-placeholder-black uppercase content-roboto-condensed
                text-[32px] leading-[42px]
                md:text-[36px] md:leading-[47px]
                lg:text-[42px] lg:leading-[55px]
                xl:text-[64px] xl:leading-[83px]
                " dangerouslySetInnerHTML={{__html: archivePageData.regionCountText || ''}}></div>
                <label className="block relative mt-6 lg:mt-10">
                    <svg className="cursor-pointer absolute left-4 xl:left-8 top-[50%] translate-y-[-50%]" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2211_34596)">
                            <path
                                d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                                fill="#0A0A0A" fillOpacity="0.6"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_2211_34596">
                                <rect width="24" height="24" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    {filterStr && <svg className="top-[50%] translate-y-[-50%] right-4 xl:right-8 cursor-pointer absolute duration-300 text-placeholder-black hover:text-main-black" onClick={() => {
                        inputRef.current.value = '';
                        setFilterStr('');
                    }} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M15.4992 14.5859L8.07437 7.16113L6.66016 8.57535L14.085 16.0002L6.66031 23.4248L8.07452 24.839L15.4992 17.4144L22.9236 24.8388L24.3378 23.4246L16.9134 16.0002L24.338 8.57556L22.9238 7.16135L15.4992 14.5859Z"
                              fill="currentColor"/>
                    </svg>}

                    <input ref={inputRef} onChange={(e) => {
                        setFilterStr(e.target.value);
                    }} className="w-full placeholder:text-placeholder-black leading-6 duration-300 rounded-2xl
                    bg-input-bg hover:bg-input-bg-hover focus:bg-input-bg-hover
                    pl-[52px] pr-12 py-[18px] text-[16px]
                    lg:text-[18px]
                    xl:text-[20px] xl:py-[28px] xl:pl-[68px] xl:pr-16
                    " placeholder="Введите название региона"
                           type="text"/>
                </label>
                {filteredData.every(group => group.regions && group.regions.length === 0) ?
                    <div className="mt-16 uppercase text-[16px] leading-[150%] font-[600]
                    text-center text-secondary-black">Ничего не найдено</div> : <div className="grid gap-x-8 gap-y-16 mt-16 min-h-[320px]
                sm:grid-cols-2
                md:grid-cols-3
                ">{filteredData.map(group => group.regions && group.regions.length > 0 && <div key={group.name}>
                        <Link href={`/region-group/${group.regionGroupSlug || ''}`} className="text-[14px] leading-[150%] hover:opacity-80 duration-200 cursor-pointer font-[600] uppercase
                    sm:text-[16px]
                    ">{group.name}</Link>
                        {group.regions.map(region => <div key={region.regionSlug} className="mt-4 text-[16px] leading-[150%]
                    md:text-[18px]
                    ">
                            <Link className="hover:opacity-80 duration-200 cursor-pointer"
                                  href={`/regions/${region.regionSlug}`}>{region.regionName}</Link>
                        </div>)}
                    </div>)}</div>}
            </div>
        </>
    )
}
