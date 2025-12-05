import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import BlackHeader from "@/components/blackHeader";
import Footer from "@/components/footer";
import {notFound} from "next/navigation";
import {getImageURL} from "@/helpers/directus";
import RegionsDetail from "@/components/regions/regionsDetail";

async function getDirections() {
    return directus.request(readItems('directions')).catch(() => []);
}

async function getContacts() {
    return directus.request(readItems('contacts')).catch(() => []);
}

async function getRegionGroupDetail(slug) {
    console.log('slug', decodeURIComponent(slug));
    return directus.request(readItems('regionGroup', {
        filter: {regionGroupSlug: decodeURIComponent(slug)},
        fields: ['*', 'projects.*', 'employees.*']
    })).catch((e) => {
        console.log(e);
        notFound();
    });
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu')).catch(() => []);
}

export async function generateMetadata({params, searchParams}, parent) {
    const slug = (await params).slug

    const [item] = await directus.request(readItems('regionGroup', {
        filter: {regionGroupSlug: decodeURIComponent(slug)},
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

const RegionGroupDetailPage = async ({params}) => {
    const pars = await params;
    const directions = await getDirections();
    const contacts = await getContacts();
    const [detail] = await getRegionGroupDetail(pars.slug);
    if (!detail) {
        notFound();
    }
    const menu = await getInformationMenu();

    return (
        <>
            <BlackHeader contacts={contacts} directions={directions} menu={menu}></BlackHeader>
            <div className="c-container">
                <RegionsDetail detail={detail}></RegionsDetail>
            </div>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}

export default RegionGroupDetailPage;
