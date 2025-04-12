'use client';
import {formatDate} from "@/helpers/formatDate";
import Link from "next/link";

const NewsDetail = ({detail, previousNews}) => {
    console.log('detail', detail);
    return (
        <>
            <div className="mx-auto max-w-[650px] pt-[176px] pb-[80px] md:pt-[200px] md:pb-[120px] xl:pb-[150px] 2xl:pb-[200px]">
                <h2 className="font-roboto-condensed font-[600]
                    text-[26px] leading-[29px]
                    md:text-[36px] md:leading-[40px]
                    xl:text-[40px] xl:leading-[44px]
                ">{detail.title}</h2>
                <p className="font-inter font-[500] text-placeholder-black mt-2
                        text-[13px] leading-[19px] lg:mt-3
                        md:text-[14px] md:leading-[21px]
                    ">{formatDate(detail.date)}</p>
                {detail.tags && detail.tags.length && <div className="mt-5 flex gap-x-2 gap-y-2 flex-wrap">{detail.tags.map(tag => tag.link ?
                    <Link key={tag.name} target="_blank" href={tag.link}>
                        <div className="news-tag news-tag__link">{tag.name}</div>
                    </Link> : <div key={tag.name} className="news-tag">{tag.name}</div>
                )}</div>}
                {detail.content && <div className="mt-8 news-content" dangerouslySetInnerHTML={{__html: detail.content}}></div>}
                <div className="mt-12 md:mt-16 grid grid-cols-1 gap-y-4">
                    {previousNews && <Link href={'/news/' + previousNews.slug} className="block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                       py-5 text-[16px] leading-6 rounded-[32px]
                       xl:py-6 xl:text-[18px] xl:rounded-[36px]
                    ">Следующая новость</Link>}
                    <Link
                        className="block border border-[rgba(10,_10,_10,_0.12)] text-center w-full font-[500] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-secondary-black
                           py-5 text-[16px] leading-6 rounded-[32px]
                           xl:py-6 xl:text-[18px] xl:rounded-[36px]
                        "
                        href="/news"><span className="xl:hidden">Еще новости</span><span className="hidden xl:inline">Список новостей</span></Link>
                </div>
            </div>
        </>
    )
}

export default NewsDetail;
