import directus from "@/lib/directus";
import {aggregate, readItems} from "@directus/sdk";
import Footer from "@/components/footer";
import BlackHeader from "@/components/blackHeader";
import NewsArchiveGrid from "@/components/news/newsArchiveGrid";
import {notFound} from "next/navigation";
import {getImageURL} from "@/helpers/directus";

async function getNews(page, limit) {
    return directus.request(readItems('news', {
        limit,
        offset: page * limit,
        sort: ['-date'],
        meta: 'total_count',
    }));
}

async function getNewsCount() {
    return directus.request(aggregate('news', {
        aggregate: {count: '*'}
    }));
}

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getContacts() {
    return directus.request(readItems('contacts'));
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu'));
}

export async function generateMetadata() {

    const item = await directus.request(readItems('newsArchivePage')).catch(() => notFound());

    const {ogImage, siteName} = await directus.request(readItems('mainPage')).catch(() => notFound());
    const imageUrl = getImageURL(ogImage);

    return {
        title: item.metaTitle,
        description: item.metaDescription,
        robots: 'index, follow',
        keywords: item.keywords || '',
        openGraph: {
            title: item.metaTitle,
            description: item.metaDescription,
            siteName,
            images: [
                {
                    url: imageUrl,
                    secureUrl: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: siteName,
                },
            ]
        }
    }
}

export default async function NewsArchivePage() {
    const directions = await getDirections();
    const contacts = await getContacts();
    const limit = 9;
    const page = 0;
    const [aggregation] = await getNewsCount();
    const menu = await getInformationMenu();
    console.log('aggregation', aggregation.count);
    const news = await getNews(page, limit);
    console.log('archive news', news);
    return (
        <>
            <BlackHeader contacts={contacts} directions={directions} menu={menu}></BlackHeader>
            <div className="c-container
                pb-[80px]
                md:pb-[120px]
                xl:pb-[150px]
                2xl:pb-[200px]
            ">
                <div className="screen-width-line
                    pt-[292px] pb-16
                    md:pt-[301px]
                    lg:pt-[284px] lg:pb-[80px]
                    xl:pt-[393px]
                    2xl:pt-[362px] 2xl:pb-[100px]
                ">
                    <h1 className="uppercase">Новости</h1>
                </div>
                <NewsArchiveGrid page={page} limit={limit} news={news} totalCount={aggregation.count}></NewsArchiveGrid>
            </div>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
