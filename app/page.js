import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import RootLayout from "@/app/layout";
import MainTopBlock from "@/components/main-page/mainTopBlock";
import MainDirectionsBlock from "@/components/main-page/mainDirectionsBlock";
import Header from "@/components/header";
import MainProjectsBlock from "@/components/main-page/mainProjectsBlock";
import MainNewsBlock from "@/components/main-page/mainNewsBlock";
import Footer from "@/components/footer";
import MainMapBlock from "@/components/main-page/mainMapBlock";
import Link from "next/link";
import {notFound} from "next/navigation";

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getProjects() {
    return directus.request(readItems('projects', {limit: 3}));
}

async function getNews() {
    return directus.request(readItems('news', {limit: 3, sort: ['-date']}));
}

async function getMainPageData() {
    return directus.request(readItems('mainPage'));
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu'));
}

async function getContacts() {
    return directus.request(readItems('contacts'));
}

export async function generateMetadata() {

    const detail = await directus.request(readItems('mainPage')).catch(() => notFound());
    console.log('detail', detail);

    return {
        title: detail.metaTitle,
        description: detail.metaDescription,
    }
}

export default async function Home() {
    const projects = await getProjects();
    const contacts = await getContacts();
    const directions = await getDirections();
    const data = await getMainPageData();
    const news = await getNews();
    const menu = await getInformationMenu();
    return (
        <>
            <Header contacts={contacts} directions={directions} withAnimation={true} menu={menu}></Header>
            <div className="md:fixed md:z-[-1] md:left-0 md:top-0 xl:min-h-[900px] h-[100vh] w-full">
                <MainTopBlock
                    topBlockImage={data.topBlockImage}
                    topBlockText={data.topBlockText}
                    topBlockVideo={data.topBlockVideo}
                    topBlockVideoPreview={data.topBlockVideoPreview}
                ></MainTopBlock>
            </div>
            <div className="xl:min-h-[900px] md:h-[100vh]"></div>
            <div id="offsetBlock"></div>
            <div className="bg-white pb-[100px] md:pb-[120px] xl:pb-[200px]">
                <MainDirectionsBlock
                    directionsBlockText={data.directionsBlockText}
                    directions={directions}
                ></MainDirectionsBlock>
                <div className="c-container mt-[100px] md:mt-[120px] xl:mt-[150px] ">
                            <h3 className="mb-6 uppercase
                    text-[32px] leading-[42px]
                    md:text-[36px] md:leading-[54px]
                    ">{data.projectsTitle}</h3>
                    <MainProjectsBlock projects={projects}></MainProjectsBlock>
                </div>
                <div className="c-container">
                    <Link className="block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                        mt-6 py-5 text-[16px] leading-6 rounded-[32px]
                        xl:py-6 xl:text-[18px] xl:rounded-[36px]
                        lg:mt-8
                        " href="/projects">
                        Больше примеров
                    </Link>
                </div>
                <MainNewsBlock news={news}></MainNewsBlock>
            </div>
            <div id="blackWrapper">
                <MainMapBlock mapBlockText={data.mapBlockText} mapBlockLink={data.mapBlockLink}></MainMapBlock>
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    );
}
