import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import Header from "@/components/header";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import Footer from "@/components/footer";
import MainProjectsBlock from "@/components/main-page/mainProjectsBlock";
import Link from "next/link";
import {notFound} from "next/navigation";

async function getProjects() {
    return directus.request(readItems('projects', {limit: 3}));
}

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getArchivePageData() {
    return directus.request(readItems('projectsPage'));
}

async function getContacts() {
    return directus.request(readItems('contacts'));
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu'));
}

export async function generateMetadata() {

    const item = await directus.request(readItems('projectsPage')).catch(() => notFound());

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

export default async function ProjectsArchivePage() {
    const projects = await getProjects();
    const directions = await getDirections();
    const contacts = await getContacts();
    const detail = await getArchivePageData();
    const menu = await getInformationMenu();
    return (
        <>
            <Header contacts={contacts} directions={directions} withAnimation={true} menu={menu}></Header>
            <div className="relative h-[600px] xl:h-[750px]">
                <div className="h-full w-full absolute left-0 top-0 z-[1] dark-gradient">
                    <div className="h-full c-container flex flex-col justify-end">
                        <h1 className="font-roboto-condensed text-white font-[600] uppercase
                            text-[36px] leading-[40px] pr-[56px] pb-[64px]
                            md:pr-10 md:text-[50px] md:leading-[55px]
                            lg:pr-[110px] lg:pb-[80px] lg:text-[60px] lg:leading-[66px]
                            xl:text-[70px] xl:leading-[77px]
                            2xl:pr-0 2xl:pb-[90px] 2xl:text-[80px] 2xl:leading-[88px]
                        ">{detail.title}</h1>
                    </div>
                </div>
                <Image quality={100} width={1320} height={0} className="w-full h-full object-cover"
                       src={getImageURL(detail.image)}
                       alt={detail.title}></Image>
            </div>
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
                    {detail.mainText && <h2 className="font-[400] font-roboto mb-6
                        text-[22px] leading-[33px]
                        sm:text-[24px] sm:leading-[36px]
                        lg:text-[36px] lg:leading-[54px]
                        xl:text-[40px] xl:leading-[60px]
                        2xl:text-[48px] 2xl:leading-[72px]
                    ">{detail.mainText}</h2>}
                    <MainProjectsBlock projects={projects}></MainProjectsBlock>
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
