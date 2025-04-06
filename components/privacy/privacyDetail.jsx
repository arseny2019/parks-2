'use client';

const PrivacyDetail = ({detail}) => {
    return (
        <>
            <div className="mx-auto max-w-[650px] pt-[176px] pb-[80px] md:pt-[200px] md:pb-[120px] xl:pb-[150px] 2xl:pb-[200px]">
                <h2 className="font-roboto-condensed font-[600]
                    text-[26px] leading-[29px]
                    md:text-[36px] md:leading-[40px]
                    xl:text-[40px] xl:leading-[44px]
                ">{detail.title}</h2>
                {detail.content && <div className="mt-8 news-content" dangerouslySetInnerHTML={{__html: detail.content}}></div>}
            </div>
        </>
    )
}

export default PrivacyDetail;
