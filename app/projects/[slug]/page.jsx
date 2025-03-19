import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import {notFound} from "next/navigation";
import ProjectTopBlock from "@/components/projects/projectTopBlock";

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getProjectDetail(slug) {
    return directus.request(readItems('projects', {
        filter: {slug},
        fields: ['*', 'gallery.*']
    })).catch(() => notFound());
}

async function getContacts() {
    return directus.request(readItems('contacts'));
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu'));
}


export async function generateMetadata({params, searchParams}, parent) {
    const slug = (await params).slug

    const [item] = await directus.request(readItems('projects', {
        filter: {slug},
        fields: ['*']
    })).catch(() => notFound());

    return {
        title: item.title,
        description: item.metaDescription || item.title,
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

    return (
        <>
            <Header contacts={contacts} directions={directions} withAnimation={true} menu={menu}></Header>
            <ProjectTopBlock detail={detail}/>
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
                    {detail.mainText && <h2 className="font-[400] font-roboto
                        text-[22px] leading-[33px]
                        sm:text-[24px] sm:leading-[36px]
                        lg:text-[36px] lg:leading-[54px]
                        xl:text-[40px] xl:leading-[60px]
                        2xl:text-[48px] 2xl:leading-[72px]
                    ">{detail.mainText}</h2>}
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

                    <Link href="/contacts" className="block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                       py-[30px] text-[20px] leading-[150%] rounded-[45px]
                       lg:py-[40px] lg:text-[22px] lg:rounded-[57px]
                    ">Связаться с нами</Link>
                </div>
            </div>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
