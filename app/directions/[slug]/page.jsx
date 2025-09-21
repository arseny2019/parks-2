import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TechnologyGrid from "@/components/directions/technologyGrid";
import Link from "next/link";
import {notFound} from "next/navigation";
import DirectionTopBlock from "@/components/directions/directionTopBlock";

async function getDirections() {
    return directus.request(readItems('directions')).catch(() => []);
}

async function getContacts() {
    return directus.request(readItems('contacts')).catch(() => []);
}

async function getDirectionDetail(slug) {
    return directus.request(readItems('directions', {
        filter: {slug},
        fields: ['*', 'technologies.*', 'directions_technologies.*', 'gallery.*']
    })).catch(() => notFound());
}

async function getTechnologies(ids) {
    return directus.request(readItems('technologies', {
        filter: {
            id:
                {
                    '_in': ids
                }
        },
        fields: ['*', 'gallery.*']
    })).catch(() => notFound());
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu')).catch(() => []);
}

export async function generateMetadata({params, searchParams}, parent) {
    const slug = (await params).slug

    const [item] = await directus.request(readItems('directions', {
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

export default async function DirectionDetailPage({params}) {
    const directions = await getDirections();
    const contacts = await getContacts();
    const {slug} = await params;
    const [detail] = await getDirectionDetail(slug);
    if (!detail) {
        notFound();
    }
    let technologies;
    if (detail.technologies && detail.technologies.length > 0) {
        technologies = await getTechnologies(detail.technologies.map(tech => tech.technologies_id));
    }
    const menu = await getInformationMenu();
    return (
        <>
            <Header contacts={contacts} directions={directions} withAnimation={true} menu={menu}></Header>
            <DirectionTopBlock detail={detail}/>
            <div id="offsetBlock"></div>
            <div className="c-container
                mt-[100px] pb-[100px]
                md:mt-[120px] md:pb-[120px]
                xl:mt-[150px] xl:pb-[150px]
                2xl:mt-[200px] 2xl:pb-[200px]
            ">
                <div className="flex flex-col
                    gap-y-[80px]
                    sm:gap-y-[100px]
                    xl:gap-y-[120px]
                    2xl:gap-y-[150px]
                ">
                    {detail.content && <h2 className="font-[400] font-roboto leading-[150%]
                        text-[22px]
                        md:text-[24px]
                        lg:text-[28px]
                        xl:text-[36px]
                    ">{detail.content}</h2>}
                    {detail.features && detail.features.length > 0 && <div>
                        {detail.features_title && <h4 className="font-bold font-roboto-condensed uppercase
                        text-[24px] leading-[36px] mb-8
                        lg:text-[30px] lg:leading-[45px] lg:mb-16
                        ">{detail.features_title}</h4>}
                        <div className="grid
                        grid-cols-1 gap-y-[40px]
                        md:grid-cols-2 md:gap-x-6 md:gap-y-[48px]
                        xl:gap-y-[80px]
                        ">
                            {detail.features.map(feature => (
                                <div key={feature.title || feature.description} className="custom-list-item flex flex-col
                                gap-y-[6px]
                                sm:gap-y-2
                                md:gap-y-3 md:pr-8
                            ">
                                    {feature.title && <p className="font-[500]
                                    text-[18px] leading-[27px]
                                    xl:text-[22px] xl:leading-[33px]
                                ">{feature.title}</p>}
                                    {feature.description && <p className="text-secondary-black
                                    text-[16px] leading-6
                                    md:text-[18px] md:leading-[27px]
                                ">
                                        {feature.description}
                                    </p>}
                                    {feature.link && <div><Link
                                        className="font-roboto font-[600] text-main-blue
                                        text-[16px] leading-6
                                        md:text-[18px] md:leading-[27px] hover:opacity-80
                                    "
                                        href={feature.link || ''}>Подробнее</Link></div>}
                                </div>
                            ))}
                        </div>
                    </div>}
                    {detail.features_2 && detail.features_2.length > 0 && <div>
                        {detail.features_2_title && <h4 className="font-bold font-roboto-condensed uppercase
                        text-[24px] leading-[36px] mb-8
                        lg:text-[30px] lg:leading-[45px] lg:mb-16
                        ">{detail.features_2_title}</h4>}
                        <div className="grid
                        grid-cols-1 gap-y-[40px]
                        md:grid-cols-2 md:gap-x-6 md:gap-y-[48px]
                        xl:gap-y-[80px]
                        ">
                            {detail.features_2.map(feature => (
                                <div key={feature.title || feature.description} className="custom-list-item flex flex-col
                                gap-y-[6px]
                                sm:gap-y-2
                                md:gap-y-3 md:pr-8
                            ">
                                    {feature.title && <p className="font-[500]
                                    text-[18px] leading-[27px]
                                    xl:text-[22px] xl:leading-[33px]
                                ">{feature.title}</p>}
                                    {feature.description && <p className="text-secondary-black
                                    text-[16px] leading-6
                                    md:text-[18px] md:leading-[27px]
                                ">
                                        {feature.description}
                                    </p>}
                                    {feature.link && <div><Link
                                        className="font-roboto font-[600] text-main-blue
                                        text-[16px] leading-6
                                        md:text-[18px] md:leading-[27px] hover:opacity-80
                                    "
                                        href={feature.link || ''}>Подробнее</Link></div>}
                                </div>
                            ))}
                        </div>
                    </div>}
                    {detail.gallery && detail.gallery.length > 0 &&
                        <div className="grid grid-cols-1 gap-y-8 md:gap-y-10">
                            {detail.gallery.map(item => <Image
                                quality={100}
                                key={item.directus_files_id}
                                className="w-full aspect-[2] rounded-3xl object-cover"
                                width={900} height={0} src={getImageURL(item.directus_files_id)}
                                alt="Изображение из галереи"/>)}
                        </div>}
                    {technologies && technologies.length > 0 &&
                        <TechnologyGrid technologies_title={detail.technologies_title}
                                        technologies={technologies}></TechnologyGrid>}
                    <Link href={detail.button_link || '/contacts'} className="block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                       py-[30px] text-[20px] leading-[150%] rounded-[45px]
                       lg:py-[40px] lg:text-[22px] lg:rounded-[57px]
                    ">{detail.button_text || 'Связаться с нами'}</Link>
                </div>
            </div>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
