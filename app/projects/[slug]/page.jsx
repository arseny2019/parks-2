import directus from "@/lib/directus";
import {readFile, readItems} from "@directus/sdk";
import {getImageURL} from "@/helpers/directus";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {notFound} from "next/navigation";
import ProjectTopBlock from "@/components/projects/projectTopBlock";
import ProjectDetailContent from "@/components/projects/projectDetailContent";
import { ModalProvider } from "@/contexts/ModalProvider";

async function getDirections() {
    return directus.request(readItems('directions')).catch(() => []);
}

async function getProjectDetail(slug) {
    return directus.request(readItems('projects', {
        filter: {slug},
        fields: ['*', 'gallery.*']
    })).catch(() => notFound());
}

async function getContacts() {
    return directus.request(readItems('contacts')).catch(() => []);
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu')).catch(() => []);
}

async function fetchFileExtension(files_array) {
    return Promise.all(files_array.map(file => directus.request(readFile(file.directus_files_id, {}))));
}


export async function generateMetadata({params, searchParams}, parent) {
    const slug = (await params).slug

    const [item] = await directus.request(readItems('projects', {
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

export default async function ProjectDetailPage({params}) {
    const directions = await getDirections();
    const contacts = await getContacts();
    const {slug} = await params;
    const [detail] = await getProjectDetail(slug);
    if (!detail) {
        notFound();
    }
    const menu = await getInformationMenu();
    const files = await fetchFileExtension(detail.gallery);
    files.forEach(file => {
        const galleryItem = detail.gallery.find(item => item.directus_files_id === file.id);
        galleryItem.type = file.type;
    })
    await detail.gallery.map(galleryItem => ({
        ...galleryItem, type: files.find(file => file.id === galleryItem.directus_files_id).type
    }));

    return (
        <ModalProvider>
            <Header contacts={contacts} directions={directions} withAnimation={true} menu={menu}></Header>
            <ProjectTopBlock detail={detail}/>
            <ProjectDetailContent detail={detail}/>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </ModalProvider>
    )
}
