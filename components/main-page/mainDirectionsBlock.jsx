import Link from "next/link";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";

const MainDirectionsBlock = ({directionsBlockText, directions}) => {

    return (
        <div className="c-container">
            {directionsBlockText && <div className="uppercase directions-block-title text-main-black text-[32px] leading-[36px] pt-[100px] font-roboto-condensed
                md:pt-[120px]
                xl:pt-[200px]
            "
                 dangerouslySetInnerHTML={{__html: directionsBlockText}}></div>}
            <div className="grid
                gap-4 grid-cols-6 mt-16
                sm:mt-20
                lg:gap-6 lg:mt-[100px]
                xl:gap-8 xl:mt-[120px]
            ">
                {directions && directions.map((direction, index) => (
                    <Link className={'col-span-6 md:col-span-3 lg:col-span-2'}
                          href={'/directions/' + direction.slug} key={direction.title + direction.id}>
                        <div className="bg-[rgba(10,_10,_10,_0.04)] hover:bg-[rgba(10,_10,_10,_0.08)] duration-300 relative
                            h-[200px] rounded-3xl p-6
                            xl:p-10 xl:h-[300px]
                        ">
                            <p className="font-inter font-[500] text-[20px] leading-[26px]
                            xl:text-[24px] xl:leading-[31px]
                            ">{direction.title}</p>
                            <Image
                                quality={100}
                                className="w-[90px] h-[90px] absolute right-2.5 bottom-2.5 xl:w-[130px] xl:h-[130px] xl:right-5 xl:bottom-5"
                                width={130} height={130} src={getImageURL(direction.icon)}
                                alt={direction.title}></Image>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MainDirectionsBlock
