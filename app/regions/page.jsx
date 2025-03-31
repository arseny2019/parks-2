import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import BlackHeader from "@/components/blackHeader";
import Footer from "@/components/footer";
import {notFound} from "next/navigation";
import RegionsComponent from "@/components/regions/regionsComponent";

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getRegions() {
    return directus.request(readItems('regions', {fields: ['*']}));
}

async function getRegionGroups() {
    return directus.request(readItems('regionGroup', {fields: ['*']}));
}

async function getPartners() {
    return directus.request(readItems('partners', {fields: ['*']}));
}

async function getPartnerCategories() {
    return directus.request(readItems('partnerCategories', {fields: ['*']}));
}

async function getContacts() {
    return directus.request(readItems('contacts'));
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu'));
}
async function getArchivePageData() {
    return directus.request(readItems('regionArchivePage'));
}

export async function generateMetadata() {

    const item = await directus.request(readItems('regionArchivePage')).catch(() => notFound());

    return {
        title: item.metaTitle,
        description: item.metaDescription || item.metaTitle,
    }
}

export default async function PartnersPage() {
    const directions = await getDirections();
    const contacts = await getContacts();
    const menu = await getInformationMenu();
    const archivePageData = await getArchivePageData();
    const regionGroups = await getRegionGroups();
    const regions = await getRegions();

    if (regions && regions.length > 0) {
        if (regionGroups && regionGroups.length > 0) {
            regionGroups.forEach((regionGroup) => {
                regionGroup.regions = regions
                    .filter((region) => region.regionGroup === regionGroup.id);
            });
        }
    }

    return (
        <>
            <BlackHeader contacts={contacts} directions={directions} menu={menu}></BlackHeader>
            <div className="c-container
            pt-[276px]
            sm:pt-[316px]
            md:pt-[301px]
            lg:pt-[274px]
            xl:pt-[393px]
            2xl:pt-[362px]
            ">
                <h1 className="uppercase">Региональные отделения</h1>
            </div>
            <RegionsComponent regionGroups={regionGroups} archivePageData={archivePageData} regions={regions}/>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
