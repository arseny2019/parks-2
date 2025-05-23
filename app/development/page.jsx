import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import {notFound} from "next/navigation";
import DirectionTopBlock from "@/components/directions/directionTopBlock";
import TechnologyGrid from "@/components/directions/technologyGrid";

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getContacts() {
    return directus.request(readItems('contacts'));
}

async function getDevelopmentDetail() {
    return directus.request(readItems('development', {
        fields: ['*', 'employees.*', 'technologies.*']
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
    return directus.request(readItems('informationMenu'));
}

export async function generateMetadata() {

    const item = await directus.request(readItems('development')).catch(() => notFound());

    const {ogImage, siteName} = await directus.request(readItems('mainPage')).catch(() => notFound());
    const imageUrl = getImageURL(ogImage);

    return {
        title: item.title,
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


export default async function DevelopmentPage({params}) {
    const directions = await getDirections();
    const contacts = await getContacts();
    const detail = await getDevelopmentDetail();
    console.log('detail', detail);
    if (!detail) {
        notFound();
    }

    let employees;
    if (detail.employees && detail.employees.length > 0) {
        employees = await getEmployees(detail.employees.map(e => e.employee_id));
    }

    let technologies;
    if (detail.technologies && detail.technologies.length > 0) {
        technologies = await getTechnologies(detail.technologies.map(e => e.technologies_id));
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
                    {detail.text && <p className="font-inter leading-[150%]
                    text-[22px]
                    md:text-[28px]
                    lg:text-[36px] lg:font-roboto
                    xl:text-[40px]
                    2xl:text-[48px]
                    ">{detail.text}</p>}
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
                                        href={feature.link}>Подробнее</Link></div>}
                                </div>
                            ))}
                        </div>
                    </div>}
                    {employees && <div className="grid grid-cols-1
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
                    </div>}
                    {technologies && technologies.length > 0 &&
                        <TechnologyGrid technologies_title={detail.technologies_title}
                                        technologies={technologies}></TechnologyGrid>}
                    <Link href="/contacts" className="block text-center w-full font-[500] bg-[rgba(10,_10,_10,_0.08)] duration-200 text-[rgba(10,_10,_10,_0.4)] hover:text-[rgba(10,_10,_10,_0.8)]
                       py-[30px] text-[20px] leading-[150%] rounded-[45px]
                       lg:py-[40px] lg:text-[22px] lg:rounded-[57px]
                    ">Вступить в совет</Link>
                </div>
            </div>
            <div id="blackWrapper">
                <Footer contacts={contacts} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
