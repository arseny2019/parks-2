import directus from "@/lib/directus";
import {readItems} from "@directus/sdk";
import BlackHeader from "@/components/blackHeader";
import Footer from "@/components/footer";
import Link from "next/link";
import {formatPhone} from "@/helpers/formatPhone";
import ContactForm from "@/components/contactForm";
import {notFound} from "next/navigation";

async function getDirections() {
    return directus.request(readItems('directions'));
}

async function getContactsData() {
    return directus.request(readItems('contacts'));
}

async function getInformationMenu() {
    return directus.request(readItems('informationMenu'));
}

export async function generateMetadata() {

    const item = await directus.request(readItems('contacts')).catch(() => notFound());

    return {
        title: item.metaTitle,
        description: item.metaDescription || item.metaTitle,
    }
}

export default async function ContactsPage() {
    const directions = await getDirections();
    const detail = await getContactsData();
    const menu = await getInformationMenu();
    console.log('contacts', detail);

    return (
        <>
            <BlackHeader directions={directions} contacts={detail} menu={menu}></BlackHeader>
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
                    <h1 className="uppercase">
                        <span className="text-main-blue">Приветствуем</span>
                        <br/>Мы на связи
                    </h1>
                </div>
                <div className="grid grid-cols-1
                    mt-[100px] gap-y-[80px]
                    md:mt-[120px] md:gap-y-[120px]
                    xl:mt-[150px] xl:grid-cols-2 md:gap-x-[32px]
                ">
                    <div className="flex flex-col
                        gap-y-6
                        md:gap-y-8
                    ">
                        <h6 className="text-placeholder-black font-[600] font-roboto uppercase
                            text-[14px] leading-[21px]
                            md:text-[16px] md:leading-[24px]
                            xl:text-[18px] xl:leading-[27px]
                        ">Контакты</h6>
                        <div>
                            <Link className="font-bold font-roboto
                                text-[28px] leading-[150%]
                                md:text-[36px]
                                xl:text-[40px]
                            " href={'tel:' + formatPhone(detail.phone)}>{detail.phone}</Link>
                        </div>
                        <div className="grid grid-cols-1 gap-y-[20px]">
                            <div>
                                <Link className="text-main-blue font-bold font-roboto
                                text-[16px] leading-[150%]
                                md:text-[18px]
                            " href={'mailto:' + detail.email}>{detail.email}</Link>
                            </div>
                            <p className="font-roboto font-[400] text-[rgba(10,_10,_10,_0.7)]
                                text-[16px] leading-[150%]
                                md:text-[18px]
                            ">{detail.address}</p>
                            <p className="font-roboto font-[400] text-[rgba(10,_10,_10,_0.7)]
                                text-[16px] leading-[150%]
                                md:text-[18px]
                            ">{detail.orgName}</p>
                        </div>
                        <div className="flex gap-x-4">
                            <Link
                                className="icon-wrapper flex justify-center items-center text-white rounded-[50%] bg-[rgba(10,_10,_10,_1)] w-14 h-14 xl:w-16 xl:h-16"
                                href={detail.vk || ''}
                                target="_blank">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     className="duration-200"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M18.5964 12.6902C18.2731 12.2819 18.3656 12.1002 18.5964 11.7352C18.6006 11.731 21.2698 8.04257 21.5448 6.79169L21.5465 6.79086C21.6832 6.33501 21.5465 6 20.8857 6H18.6989C18.1422 6 17.8856 6.28751 17.748 6.60919C17.748 6.60919 16.6347 9.27428 15.0596 11.0018C14.5513 11.501 14.3163 11.661 14.0388 11.661C13.9021 11.661 13.6896 11.501 13.6896 11.0452V6.79086C13.6896 6.24418 13.5337 6 13.0729 6H9.63443C9.28525 6 9.07775 6.25501 9.07775 6.49252C9.07775 7.01087 9.86527 7.13004 9.94694 8.58842V11.7527C9.94694 12.4461 9.8211 12.5736 9.54193 12.5736C8.79857 12.5736 6.99434 9.89764 5.92514 6.83503C5.7093 6.24084 5.49845 6.00083 4.9376 6.00083H2.75003C2.12584 6.00083 2 6.28834 2 6.61002C2 7.17837 2.74336 10.0043 5.45679 13.7378C7.26518 16.2862 9.81194 17.6671 12.1287 17.6671C13.5212 17.6671 13.6912 17.3604 13.6912 16.8329C13.6912 14.3978 13.5654 14.1678 14.2629 14.1678C14.5863 14.1678 15.143 14.3278 16.443 15.557C17.9289 17.0146 18.1731 17.6671 19.0048 17.6671H21.1915C21.8149 17.6671 22.1307 17.3604 21.949 16.7554C21.5332 15.4828 18.7231 12.8652 18.5964 12.6902Z"
                                        fill="currentColor"/>
                                </svg>
                            </Link>
                            <Link className="icon-wrapper flex justify-center items-center rounded-[50%] text-white bg-[rgba(10,_10,_10,_1)] w-14 h-14 xl:w-16 xl:h-16"
                                  href={detail.telegram || ''}
                                  target="_blank">
                                <svg width="24" height="24" className="duration-200"
                                     viewBox="0 0 24 24"
                                     fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.84784 14.9848L9.517 19.6382C9.99034 19.6382 10.1953 19.4349 10.4412 19.1907L12.6604 17.0698L17.2588 20.4374C18.1022 20.9074 18.6964 20.6599 18.9239 19.6615L21.9423 5.51787L21.9431 5.51704C22.2106 4.27034 21.4923 3.78283 20.6706 4.08867L2.9285 10.8813C1.71764 11.3513 1.73598 12.0264 2.72267 12.3322L7.25861 13.7431L17.7947 7.15041C18.2905 6.82207 18.7414 7.00374 18.3705 7.33208L9.84784 14.9848Z"
                                        fill="currentColor"/>
                                </svg>
                            </Link>
                            <Link className="icon-wrapper flex justify-center items-center rounded-[50%] text-white bg-[rgba(10,_10,_10,_1)] w-14 h-14 xl:w-16 xl:h-16"
                                  href={detail.vc_ru || ''}
                                  target="_blank">
                                <svg width="24" height="25" className="duration-200" viewBox="0 0 24 25" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_2027_72022)">
                                        <path
                                            d="M17.6949 11.5862C19.2131 11.5862 20.3561 10.9536 21.1988 9.8525L20.0725 8.99313C19.7943 9.3598 19.4347 9.65685 19.0221 9.86086C18.6095 10.0649 18.1551 10.1703 17.6949 10.1688C16.0472 10.1688 14.8532 8.8264 14.8532 7.17927C14.8532 5.53213 16.0277 4.11418 17.7419 4.11418C18.5038 4.11418 19.0424 4.29407 19.5122 4.58511V6.03343H20.9296V3.92168L20.658 3.70797C19.8788 3.09495 18.6889 2.76953 17.6943 2.76953C15.2628 2.76953 13.2851 4.74725 13.2851 7.17871C13.2851 9.60787 15.2623 11.5862 17.6949 11.5862ZM20.6357 20.283L20.5852 18.2532V13.2997H17.629V14.7177H19.0922V18.0784C19.0922 19.5262 17.9865 20.5511 16.871 20.5511C15.7556 20.5511 15.1735 19.7777 15.1735 18.3305V13.2992H12.412V14.7171H13.6804V18.5763C13.6804 20.5403 14.7816 21.8935 16.7456 21.8935C17.8742 21.8935 18.7336 21.2673 19.2463 20.3019H19.2693L19.4715 21.6517H21.7431V20.2847H20.6374V20.2819L20.6357 20.283ZM12.9586 2.9775H10.495L8.35232 9.19937H8.31909L6.18784 2.9775H3.56274V4.39604H5.03915L7.58003 11.4876H8.92982V11.4859L11.5796 4.39661H12.9574V2.97808L12.9586 2.9775ZM1.25732 21.67H2.71712V20.2108H1.2579V21.67H1.25732ZM6.89482 14.944H6.87878L6.78712 13.2997H4.18149V14.5922H5.56795V20.2836H4.18149V21.6511H10.6211V20.3105H7.03576V16.8759C7.1979 15.6327 8.13003 14.571 9.40191 14.571H9.42482L9.39904 15.8418H10.8164V13.2762H9.69581C8.41248 13.2728 7.46029 13.9672 6.89425 14.9446L6.89482 14.944Z"
                                            fill="currentColor"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2027_72022">
                                            <rect width="20.625" height="22" fill="currentColor"
                                                  transform="translate(1.1875 1.33203)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </Link>
                            <Link
                                className="icon-wrapper flex justify-center items-center rounded-[50%] bg-[rgba(10,_10,_10,_1)] w-14 h-14 xl:w-16 xl:h-16"
                                href={detail.dzen || ''}
                                target="_blank">
                                <svg width="24" height="25" className="duration-200" viewBox="0 0 24 25" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_2027_72062)">
                                        <path
                                            d="M13.9286 14.2606C12.3571 15.882 12.2429 17.9035 12.1071 22.332C16.2357 22.332 19.0857 22.3177 20.5571 20.8892C21.9857 19.4177 22 16.432 22 12.4392C17.5714 12.582 15.55 12.6892 13.9286 14.2606ZM2 12.4392C2 16.432 2.01429 19.4177 3.44286 20.8892C4.91429 22.3177 7.76429 22.332 11.8929 22.332C11.75 17.9035 11.6429 15.882 10.0714 14.2606C8.45 12.6892 6.42857 12.5749 2 12.4392ZM11.8929 2.33203C7.77143 2.33203 4.91429 2.34632 3.44286 3.77489C2.01429 5.24632 2 8.23203 2 12.2249C6.42857 12.082 8.45 11.9749 10.0714 10.4035C11.6429 8.78203 11.7571 6.7606 11.8929 2.33203ZM13.9286 10.4035C12.3571 8.78203 12.2429 6.7606 12.1071 2.33203C16.2357 2.33203 19.0857 2.34632 20.5571 3.77489C21.9857 5.24632 22 8.23203 22 12.2249C17.5714 12.082 15.55 11.9749 13.9286 10.4035Z"
                                            fill="currentColor"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2027_72062">
                                            <rect width="20" height="20" fill="currentColor"
                                                  transform="translate(2 2.33203)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </Link>
                        </div>
                    </div>
                    <ContactForm></ContactForm>
                </div>
            </div>
            <div id="blackWrapper">
                <Footer contacts={detail} directions={directions} menu={menu}></Footer>
            </div>
        </>
    )
}
