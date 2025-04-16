'use client';

import Link from "next/link";
import {formatPhone} from "@/helpers/formatPhone";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";

const RegionsDetail = ({detail}) => {
    console.log('detail', detail);
    return (
        <>
            <div
                className="uppercase
                    pt-[206px]
                    sm:pt-[246px]
                    md:pt-[259px]
                    lg:pt-[219px]
                    xl:pt-[329px]
                    2xl:pt-[292px]
                ">
                <h2 className="font-roboto-condensed font-[600]
                        text-[36px] leading-[110%]
                        md:text-[50px]
                        lg:text-[60px]
                        xl:text-[70px]
                    ">{detail.regionName}</h2>
                <p className="font-roboto-condensed font-[600] text-placeholder-black
                        mt-4 text-[20px] leading-[110%]
                        md:text-[24px]
                        lg:mt-5 lg:text-[32px]
                        xl:text-[40px]
                        2xl:text-[45px]
                    ">{detail.subtitle || 'Региональное отделение'}</p>
            </div>
            <div className="grid
                py-[100px] gap-y-[100px]
                lg:py-[120px] lg:gap-y-[120px]
                xl:py-[150px]
            ">
                {detail.employees && detail.employees.length > 0 && <div className="max-w-[600px]">
                    <p className="font-[600] leading-[150%] text-placeholder-black uppercase
                        text-[16px]
                        lg:text-[18px]"
                    >Состав</p>
                    <div className="mt-6 lg:mt-8 max-width-[600px] flex flex-col gap-y-8 md:gap-y-10">
                        {detail.employees && detail.employees.length > 0 && detail.employees.map((employee) => <div
                            key={employee.name}
                            className="flex gap-x-4 md:gap-x-5">
                            <Image className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-[50%]"
                                   width={72} height={72}
                                   src={employee.image ? getImageURL(employee.image) : '/person-placeholder.png'}
                                   alt={employee.name}></Image>
                            <div>
                                <p className="font-medium text-[18px] md:text-[20px] leading-[24px]">{employee.name}</p>
                                <p className="font-medium text-placeholder-black text-[14px] leading-[150%] mt-2 md:mt-3 md:text-[16px]">{employee.post}</p>
                            </div>
                        </div>)}
                    </div>
                </div>}
                {(detail.phone || detail.email || detail.address) && <div>
                    <p className="font-[600] leading-[150%] text-placeholder-black uppercase
                        text-[16px]
                        lg:text-[18px]"
                    >Контакты</p>
                    <div className="mt-6 lg:mt-8">
                        <Link className="font-bold font-roboto
                                text-[28px] leading-[150%]
                                md:text-[32px]
                            " href={'tel:' + formatPhone(detail.phone)}>{detail.phone}</Link>
                    </div>
                    <div className="mt-6">
                        <Link className="text-main-blue font-bold font-roboto
                                text-[16px] leading-[150%]
                                md:text-[18px]
                            " href={'mailto:' + detail.email}>{detail.email}</Link>
                    </div>
                    <p className="max-w-[600px] mt-5 font-roboto font-[400] text-[rgba(10,_10,_10,_0.8)]
                                text-[16px] leading-[150%]
                                md:text-[18px]
                            ">{detail.address}</p>
                </div>}
                {detail.projects && detail.projects.length > 0 && <div>
                    <p className="font-[600] leading-[150%] text-placeholder-black uppercase
                        text-[16px]
                        lg:text-[18px]"
                    >Проекты и инициативы</p>
                    <div className="mt-6 lg:mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {detail.projects.map((project) => <Link
                            className="region-card relative h-[240px] md:h-[200px] xl:h-[240px]"
                            key={project.slug} href={`/region-project/${project.slug}`}>
                            <div
                                className="absolute left-0 top-0 h-full w-full z-[1] projects-gradient rounded-3xl"></div>
                            <p className="text-left uppercase absolute left-0 top-0 w-full h-full z-[2] p-6 md:p-8 text-white
                            text-[24px] leading-[29px] font-roboto-condensed font-bold
                                md:text-[28px] md:leading-[33px]">{project.title}</p>
                            <Image quality={100} width={1360} height={0} src={getImageURL(project.image)}
                                   className="absolute left-0 top-0 rounded-3xl h-full w-full object-cover"
                                   alt={project.title}/>
                        </Link>)}
                    </div>
                </div>}
            </div>
        </>
    )
}

export default RegionsDetail;
