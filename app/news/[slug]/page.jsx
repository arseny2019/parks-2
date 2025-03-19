import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import BlackHeader from "@/components/blackHeader";
import Footer from "@/components/footer";
import NewsDetail from "@/components/news/newsDetail";
import {notFound} from "next/navigation";

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getContacts() {
    return directus.request(readItems('contacts'));
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
    return directus.request(readItems('informationMenu'));
}

export async function generateMetadata({params, searchParams}, parent) {
    const slug = (await params).slug

    const [item] = await directus.request(readItems('news', {
        filter: {slug},
        fields: ['*']
    })).catch(() => notFound());

    return {
        title: item.title || '',
        description: item.metaDescription || item.title || '',
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
