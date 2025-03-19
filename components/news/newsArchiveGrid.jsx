'use client';
import Link from "next/link";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import {formatDate} from "@/helpers/formatDate";
import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import {useEffect, useState} from "react";

async function getNews(page, limit) {
    return directus.request(readItems('news', {
        limit, offset: page * limit, meta: 'total_count',  sort: ['-date']
    }));
}

const NewsArchiveGrid = ({page, limit, news, totalCount}) => {
    const [items, setItems] = useState(news);
    const [_page, _setPage] = useState(page);
    const [_limit, _setLimit] = useState(limit);
    const [loading, setLoading] = useState(false);
    const [canLoad, setCanLoad] = useState(news.length < totalCount);
    useEffect(() => {
        setCanLoad(items.length < totalCount);
    }, [_page, items]);
    return (
        <>
            <div className="grid
                    grid-cols-1 gap-y-8 mt-[80px]
                    sm:mt-[64px]
                    md:grid-cols-2 md:gap-x-8
                    lg:grid-cols-3
                    2xl:gap-y-10 2xl:mt-[80px]
                ">
                {items && items.map(item => (
                    <Link href={'/news/' + item.slug} key={item.title + item.id} className="news-item">
                        <Image width={480} height={0}
                               quality={100}
                               className="duration-300 news-item-image object-cover w-full aspect-[1.65] rounded-3xl"
                               src={getImageURL(item.thumbnail)} alt={item.title}></Image>
                        <p className="font-inter text-secondary-black mt-4
                                text-[16px] leading-6
                                lg:text-[20px] lg:leading-[30px] lg:mt-5
                            ">{item.title}</p>
                        <p className="font-inter font-[500] text-placeholder-black mt-2
                                text-[13px] leading-[19px] lg:mt-3
                            ">{formatDate(item.date)}</p>
                    </Link>))}
            </div>
            {canLoad && <button className="block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                       mt-8 py-5 text-[16px] leading-6 rounded-[32px]
                       xl:py-6 xl:text-[18px] xl:rounded-[36px]
                       2xl:mt-10
                    "
                    disabled={loading} onClick={async () => {
                setLoading(true);
                console.log('_page', _page);
                const newItems = await getNews(_page + 1, _limit);
                setItems([...items, ...newItems]);
                setLoading(false);
                _setPage(_page + 1);
            }}
            >
                Загрузить еще
            </button>}
        </>
    )
}

export default NewsArchiveGrid;
