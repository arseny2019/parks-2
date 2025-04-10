'use client';
import Link from "next/link";

const RegionProjectDetail = ({detail}) => {
    console.log('detail', detail);
    return (
        <>
            <div className="mx-auto max-w-[650px] pt-[176px] pb-[80px] md:pt-[200px] md:pb-[120px] xl:pb-[150px] 2xl:pb-[200px]">
                <h2 className="font-roboto-condensed font-[600]
                    text-[26px] leading-[29px]
                    md:text-[36px] md:leading-[40px]
                    xl:text-[40px] xl:leading-[44px]
                ">{detail.title}</h2>
                {detail.region && detail.region.regionName && <div className="mt-5 flex gap-x-2 gap-y-2">
                    <Link href={`/regions/${detail.region.regionSlug}`}>
                        <div className="news-tag news-tag__link">{detail.region.regionName}</div>
                    </Link>
                </div>}
                {detail.content && <div className="mt-8 news-content" dangerouslySetInnerHTML={{__html: detail.content}}></div>}
                <Link href={`/regions/${detail.region.regionSlug}`} className="mt-16 block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                       py-6 text-[18px] leading-6 rounded-[36px]
                    ">Вернуться назад</Link>
            </div>
        </>
    )
}

export default RegionProjectDetail;
