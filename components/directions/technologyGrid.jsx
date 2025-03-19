'use client';
import TechnologyModal from "@/components/technologyModal";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";

const TechnologyGrid = ({ technologies, technologies_title }) => {

    return(
        <>
            <div>
                <h3 className="uppercase font-roboto-condensed font-bold
                            text-[28px] leading-[120%]
                            md:text-[36px]
                        ">{technologies_title}</h3>
                <div className="mt-6 grid grid-cols-1
                        gap-y-6
                        lg:gap-y-8
                        ">
                    {technologies.map(item => <div key={item.title + item.image} >
                        <TechnologyModal technology={item}></TechnologyModal>
                        <button onClick={(e) => {
                        const modal = e.target.parentNode.parentNode.querySelector('.modal-container');
                        const overlay = e.target.parentNode.parentNode.querySelector('.modal-overlay');
                        console.log('modal', modal);
                        modal.classList.remove('translate-x-[100%]');
                        overlay.classList.remove('invisible', 'opacity-0');
                        document.body.classList.add('menu-open');
                    }} className="w-full project-card h-[250px] relative">

                        <div className="absolute left-0 top-0 h-full w-full z-[1] projects-gradient rounded-3xl"></div>
                        <p className="text-left uppercase absolute left-0 top-0 w-full h-full z-[2] px-6 py-8 text-white text-[28px] leading-[34px] font-roboto-condensed font-bold
                                lg:text-[36px] lg:leading-[43px]
                                xl:pt-12 xl:pl-10 xl:pr-[54px] xl:text-[40px] xl:leading-[48px]">{item.title}</p>
                        <Image quality={100} width={1360} height={0} src={getImageURL(item.image)}
                               className="absolute left-0 top-0 rounded-3xl h-full w-full object-cover"
                               alt={item.title}/>
                    </button></div>)}
                </div>
            </div>
        </>
    )
}

export default TechnologyGrid;
