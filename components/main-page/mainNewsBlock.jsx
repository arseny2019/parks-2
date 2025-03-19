import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import {formatDate} from "@/helpers/formatDate";
import Link from "next/link";

const MainNewsBlock = ({news}) => {

    return (
        <>
            <div className="mt-[100px] md:mt-[120px] xl:mt-[150px] text-main-black">
                <h3 className="c-container uppercase
                    text-[32px] leading-[42px]
                    md:text-[36px] md:leading-[54px]
                    ">Новости</h3>
                <div className="mt-6 overflow-auto w-full lg:px-10 md:px-8 px-6 lg:mx-auto lg:max-w-[1440px]">
                    <div className="flex gap-x-4
                md:gap-x-6
                lg:gap-x-8
                lg:grid lg:grid-cols-3
                ">
                        {news && news.map(item => (
                            <Link href={'/news/' + item.slug} key={item.title + item.id} className="inline-block news-item
                    min-w-[290px]
                    sm:min-w-[320px]
                    md:min-w-[315px]
                    lg:min-w-[auto]
                ">
                                <Image quality={100} width={480} height={0} className="duration-300 news-item-image object-cover w-full aspect-[1.65] rounded-3xl"
                                       src={getImageURL(item.thumbnail)} alt={item.title}></Image>
                                <p className="font-inter text-secondary-black mt-4
                    text-[16px] leading-6
                    lg:text-[20px] lg:leading-[30px] lg:mt-5

                    ">{item.title}</p>
                                <p className="font-inter font-[500] text-placeholder-black mt-2
                        text-[13px] leading-[19px] lg:mt-3
                    ">{formatDate(item.date)}</p>
                            </Link>))}
                        <div className="lg:hidden opacity-0">1</div>
                    </div>
                </div>
            </div>
            <div className="c-container">
                <Link className="c-container block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                       mt-6 py-5 text-[16px] leading-6 rounded-[32px]
                       xl:py-6 xl:text-[18px] xl:rounded-[36px]
                       lg:mt-8
                    " href="/news">
                    Посмотреть все новости
                </Link>
            </div>
        </>

    )
}

export default MainNewsBlock;
