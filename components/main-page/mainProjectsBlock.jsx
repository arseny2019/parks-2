import Link from "next/link";
import Image from "next/image";
import {getImageURL} from "@/helpers/directus";

const MainProjectsBlock = ({projects}) => {

    return (

        <div className="grid grid-cols-1 gap-y-4
            md:gap-y-6
            lg:gap-y-8
            ">
            {projects && projects.map((project, index) => <Link
                href={'/projects/' + project.slug}
                className="block relative rounded-3xl overflow-hidden project-card
                    h-[360px]
                    md:h-[280px]
                    lg:h-[320px]
                    xl:h-[360px]
                    2xl:h-[400px]
                    "
                key={project.title + index}>
                <Image quality={100} width={1360} height={720} className="object-cover h-full w-full absolute left-0 top-0"
                       src={getImageURL(project.image)} alt={project.title}></Image>
                <div className="projects-gradient h-full w-full absolute top-0 left-0"></div>
                <div className="absolute left-0 top-0 w-full h-full
                    py-8 px-6
                    xl:py-12 xl:px-10
                    ">
                    <h4 className="text-white uppercase
                        text-[36px] leading-[43px]
                        xl:text-[40px] xl:leading-[48px]
                        ">{project.title}</h4>
                    {project.description && <div className="text-secondary-white font-[400]
                        text-[18px] leading-[22px]
                        mt-6
                        md:max-w-[640px]
                        xl:text-[20px] xl:leading-[24px]
                        " dangerouslySetInnerHTML={{__html: project.description}}></div>}
                </div>
            </Link>)}
        </div>
    )
}

export default MainProjectsBlock;
