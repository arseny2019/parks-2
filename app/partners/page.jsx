import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import BlackHeader from "@/components/blackHeader";
import Footer from "@/components/footer";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import Link from "next/link";
import {notFound} from "next/navigation";

async function getDirections() {
    return directus.request(readItems('directions'));
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

export async function generateMetadata() {

    const item = await directus.request(readItems('partnersArchivePage')).catch(() => notFound());

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

export default async function PartnersPage() {
    const directions = await getDirections();
    const contacts = await getContacts();
    const partners = await getPartners();
    const categories = await getPartnerCategories();
    const menu = await getInformationMenu();
    const partnersMap = {};
    categories.forEach(category => {
        partnersMap[category.name] = partners
            .filter(partner => partner.category.key === category.id);
    });
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
                    <h1 className="uppercase">Партнеры</h1>
                </div>
                {partners && partners.length > 0 && <div className="grid grid-cols-1 lg:gap-y-[120px]
                    mt-[100px] gap-y-[64px]
                    sm:gap-y-[80px]
                    md:mt-[120px] md:gap-y-[100px]
                    xl:mt-[150px] xl:md-gap-y-[120px]
                    2xl:mt-[200px]
                ">
                    {categories && categories.length > 0
                        && categories.map(category =>
                            partnersMap[category.name] && partnersMap[category.name].length > 0 && <div key={category.name}>
                            <h6 className="font-roboto font-[600] text-placeholder-black uppercase
                            text-[14px] leading-[21px]
                            md:text-[16px] md:leading-[24px]
                            xl:text-[18px] xl:leading-[27px]
                        ">{category.name}</h6>
                            <div className="grid
                            grid-cols-2 gap-4 mt-6
                            md:grid-cols-3 md:gap-6
                            lg:grid-cols-4
                        ">
                                {partnersMap[category.name].map(partner => (
                                    <div key={partner.title + 'government'}>
                                        {!partner.link && <div className="bg-main-gray py-4 rounded-[16px] md:rounded-3xl md:p-4">
                                            <Image
                                                quality={100}
                                                className="object-contain aspect-[1.8] w-full"
                                                width={480} height={0} src={getImageURL(partner.image)}
                                                alt={partner.title}></Image>
                                        </div>}
                                        {partner.link && <Link href={partner.link || ''} target="_blank"
                                                               className="block bg-main-gray duration-200 hover:bg-secondary-gray py-4 rounded-[16px] md:rounded-3xl md:p-4">
                                            <Image
                                                quality={100}
                                                className="object-contain aspect-[1.8] w-full"
                                                width={480} height={0} src={getImageURL(partner.image)}
                                                alt={partner.title}></Image>
                                        </Link>}
                                    </div>
                                ))}
                            </div>
                        </div>)}
                </div>}
            </div>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
