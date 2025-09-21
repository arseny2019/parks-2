import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import BlackHeader from "@/components/blackHeader";
import Footer from "@/components/footer";
import NewsDetail from "@/components/news/newsDetail";
import {notFound} from "next/navigation";
import {getImageURL} from "@/helpers/directus";

async function getDirections() {
    return directus.request(readItems('directions')).catch(() => []);
}

async function getContacts() {
    return directus.request(readItems('contacts')).catch(() => []);
}

async function getNewsDetail(slug) {
    return directus.request(readItems('news', {
        filter: {slug},
        fields: ['*']
    })).catch(() => notFound());
}

async function getNextNews(date) {
    return directus.request(readItems('news', {
        filter: {
            date: {"_lt": date}
        },
        sort: ['-date'],
        limit: 1,
        fields: ['*']
    })).catch(() => notFound());
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu')).catch(() => []);
}

export async function generateMetadata({params, searchParams}, parent) {
    const slug = (await params).slug

    const [item] = await directus.request(readItems('news', {
        filter: {slug},
        fields: ['*']
    })).catch(() => notFound());

    const {ogImage, siteName} = await directus.request(readItems('mainPage')).catch(() => notFound());
    const imageUrl = getImageURL(ogImage);

    return {
        title: item.title,
        description: item.metaDescription,
        robots: 'index, follow',
        keywords: item.keywords || '',
        openGraph: {
            title: item.title,
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

const NewsDetailPage = async ({params}) => {
    const pars = await params;
    const directions = await getDirections();
    const contacts = await getContacts();
    const [detail] = await getNewsDetail(pars.slug);
    if (!detail) {
        notFound();
    }
    const res = await getNextNews(detail.date);
    const menu = await getInformationMenu();


    return (
        <>
            <BlackHeader contacts={contacts} directions={directions} menu={menu}></BlackHeader>
            <div className="c-container">
                <NewsDetail detail={detail} previousNews={res[0] || false}/>
            </div>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}

export default NewsDetailPage;
