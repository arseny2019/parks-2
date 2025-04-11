import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import {notFound} from "next/navigation";
import DirectionTopBlock from "@/components/directions/directionTopBlock";

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getContacts() {
    return directus.request(readItems('contacts'));
}

async function getAboutDetail() {
    return directus.request(readItems('about', {
        fields: ['*']
    })).catch(() => notFound());
}

async function getEmployees(ids) {
    return directus.request(readItems('employee', {
        fields: ['*'],
        filter: {
            id: {
                '_in': ids
            }
        },
    })).catch(() => notFound());
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu'));
}

export async function generateMetadata() {

    const item = await directus.request(readItems('about')).catch(() => notFound());

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


export default async function DevelopmentPage({params}) {
    const directions = await getDirections();
    const contacts = await getContacts();
    const detail = await getAboutDetail();
    console.log('detail', detail);
    if (!detail) {
        notFound();
    }
    let employees;
    if (detail.employees) {
        employees = await getEmployees(detail.employees);
    }

    const menu = await getInformationMenu();

    console.log('employees', employees);


    return (
        <>
            <Header contacts={contacts} directions={directions} withAnimation={true} menu={menu}></Header>
            <DirectionTopBlock detail={detail}/>
            <div id="offsetBlock"></div>
            <div className="c-container
                py-[100px]
                md:py-[120px]
                xl:py-[150px]
                2xl:py-[200px]
            ">
                <div className="flex flex-col
                    gap-y-[80px]
                    md:gap-y-[100px]
                    xl:gap-y-[120px]
                    2xl:gap-y-[150px]
                ">
                    {detail.text && <div className="uppercase directions-block-title"
                                         dangerouslySetInnerHTML={{__html: detail.text}}></div>}
                    {employees && <div>
                        {detail.employeesTitle && <h3 className="mb-6 md:mb-8 uppercase text-[32px] leading-[42px] md:text-[36px] md:leading-[54px]">{detail.employeesTitle}</h3>}
                        <div className="grid grid-cols-1
                        gap-y-12
                        md:gap-y-16 md:gap-x-8 md:grid-cols-2
                        2xl:gap-x-16
                    ">
                        {employees && employees.length > 0 && employees.map((employee) => <div key={employee.name}
                                                                                                                    className="flex gap-x-4 xl:gap-x-5">
                            <Image className="w-20 h-20 xl:w-[100px] xl:h-[100px] rounded-[50%]"
                                   width={80} height={80} src={employee.image ? getImageURL(employee.image) : '/person-placeholder.png'} alt={employee.name}></Image>
                            <div>
                                <p className="font-medium text-[18px] xl:text-[22px] leading-[150%]">{employee.name}</p>
                                <p className="font-medium text-placeholder-black text-[14px] leading-[150%] mt-2 xl:text-[16px]">{employee.post}</p>
                            </div>
                        </div>)}
                    </div></div>}
                </div>
            </div>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
