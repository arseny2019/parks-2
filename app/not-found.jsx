import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import Footer from "@/components/footer";
import Link from "next/link";
import BlackHeader from "@/components/blackHeader";

async function getDirections() {
    return directus.request(readItems('directions')).catch(() => []);
}

async function getContactsData() {
    return directus.request(readItems('contacts')).catch(() => []);
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu')).catch(() => []);
}

export async function generateMetadata() {

    return {
        title: 'Страница не найдена',
        description: 'Произошла ошибка, Неправильно набран адрес, или такой страницы на сайте больше не существует',
    }
}

export default async function Custom404() {
    const directions = await getDirections();
    const detail = await getContactsData();
    const menu = await getInformationMenu();

    return (
        <>
            <BlackHeader directions={directions} contacts={detail} menu={menu}></BlackHeader>
            <div className="c-container
             pt-[226px] pb-[200px]
             md:pt-[250px]
             ">
                <h1 className="font-[600] font-roboto-condensed text-main-blue
                    text-[140px] leading-[154px]
                    md:text-[200px] md:leading-[220px]
                    xl:text-[240px] xl:leading-[264px]
                ">404</h1>
                <p className="text-secondary-black uppercase font-roboto-condensed
                text-[20px] leading-[150%] mt-10
                md:text-[24px]
                lg:text-[28px]
                xl:text-[32px]
                ">Неправильно набран адрес,<br/> или такой страницы на сайте<br/>больше не существует</p>
                <Link href="/" className="text-white font-[500] bg-background-black inline-flex justify-center items-center
                px-6 py-4 text-[16px] leading-[150%] rounded-[28px] mt-10
                "><span>Перейти на главную</span></Link>
            </div>
            <div id="blackWrapper">
                <Footer contacts={detail} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
