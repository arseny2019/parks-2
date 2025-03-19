'use client';
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import Navigation from "@/components/navigation";
import Link from "next/link";

const Header = ({withAnimation, directions, contacts, menu}) => {
    const [burgerActive, setBurgerActive] = useState(false);
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const secondHeader = useRef(null);
    const blackCircleRef = useRef(null);
    const headerInnerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [heightOnAnimate, setHeightOnAnimate] = useState(0);
    const [heightOnHide, setHeightOnHide] = useState(0);
    const [activeHeader, setActiveHeader] = useState(false);
    const [activeMenu, setActiveMenu] = useState(false);

    useEffect(() => {
        const blackWrapper = document.querySelector('#blackWrapper');
        setHeaderHeight(headerRef.current.getBoundingClientRect().height);
        setHeightOnAnimate(containerRef.current.getBoundingClientRect().height);
        setHeightOnHide(blackWrapper.offsetTop  - headerHeight);

        function handleScroll() {
            if (heightOnAnimate) {
                if (window.scrollY > heightOnAnimate && window.scrollY < heightOnHide) {
                    if (!activeHeader) {
                        setActiveHeader(true);
                    }
                } else {
                    setActiveHeader(false);
                }
            }
        }

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };

    }, [containerRef, withAnimation, heightOnAnimate, activeHeader]);

    useEffect(() => {
        if (heightOnAnimate) {
            if (window.scrollY > heightOnAnimate && window.scrollY < heightOnHide) {
                if (!activeHeader) {
                    setActiveHeader(true);
                }
            } else {
                if (activeHeader) {
                    setActiveHeader(false);
                }
            }
        }
    });

    useEffect(() => {
        if (headerRef && headerRef.current) {
            if (activeHeader) {
                secondHeader.current.classList.remove('opacity-0', 'invisible');
            } else {
                secondHeader.current.classList.add('opacity-0', 'invisible');
            }
        }

    }, [activeHeader]);

    useEffect(() => {
        if (burgerActive && blackCircleRef) {
            setActiveMenu(true);
            blackCircleRef.current.classList.remove('scale-0', 'delay-300');
        } else if (!burgerActive && blackCircleRef) {
            setActiveMenu(false);
            blackCircleRef.current.classList.add('scale-0', 'delay-300');
        }
    }, [burgerActive, blackCircleRef]);


    useEffect(() => {

        function calculateScrollbarWidth() {
            const scrollDiv = document.createElement('div');
            scrollDiv.style.overflowY = 'scroll';
            scrollDiv.style.width = '50px';
            scrollDiv.style.height = '50px';
            document.body.appendChild(scrollDiv);
            const scrollWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            document.documentElement.style.setProperty('--scrollbar-width', scrollWidth + 'px');
        }

        calculateScrollbarWidth();
    }, []);

    useEffect(() => {
        if (!document.body) return;

        if (activeMenu) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    }, [activeMenu]);

    return (
        <>
            {withAnimation && <div ref={containerRef}
                                   className="absolute left-0 top-0 -z-[1] xl:min-h-[900px] h-[100vh] w-full"></div>}
            <header ref={headerRef} className="duration-300 w-full absolute top-0 left-0 z-10 h-[88px] xl:h-[90px]">
                <div className="absolute left-0 top-0 w-full">
                    <div ref={headerInnerRef} className="mx-auto flex justify-between items-center duration-200
                    2xl:max-w-[1680px] 3xl:pl-[120px] 3xl:pr-[120px]
                    lg:pr-10 lg:pl-10
                    md:pr-6
                    pl-6 pt-8 pr-4 pb-4
                    ">
                        <Link href="/">
                            <Image width={142} height={46} src={"/logo.svg"}
                                   className="h-[44px] w-[138px] md:h-[46px] md:w-[142px]" alt="Logo"></Image>
                        </Link>

                        <div onClick={() => setBurgerActive(!burgerActive)}
                             className="text-white cursor-pointer relative burger-container flex justify-center items-center w-10 h-10">
                                <span className="burger">
                                    <span className="burger-line"></span>
                                </span>
                        </div>
                    </div>
                </div>
            </header>
            <header ref={secondHeader}
                    className="backdrop-blur-[50px] bg-[rgba(255,_255,_255,_0.6)] duration-300 w-full fixed top-0 left-0 z-10 h-[88px] xl:h-[90px]">
                <div className="absolute left-0 top-0 w-full">
                    <div ref={headerInnerRef} className="mx-auto flex justify-between items-center duration-200
                    2xl:max-w-[1680px] 3xl:pl-[120px] 3xl:pr-[120px]
                    lg:pr-10 lg:pl-10
                    md:pr-6
                    pl-6 pt-8 pr-4 pb-4
                    ">
                        <Link href="/">
                            <Image width={142} height={46}
                                   src={"/logo-black.svg"}
                                   className="h-[44px] w-[138px] md:h-[46px] md:w-[142px]" alt="Logo"></Image>
                        </Link>

                        <div onClick={() => setBurgerActive(!burgerActive)}
                             className="text-main-black cursor-pointer relative burger-container flex justify-center items-center w-10 h-10">
                                <span className="burger">
                                    <span className="burger-line"></span>
                                </span>
                        </div>
                    </div>
                </div>
            </header>
            <div ref={blackCircleRef} className="fixed right-0 top-0 scale-0 z-10 origin-center
                translate-x-[50%] translate-y-[-50%] duration-500 bg-main-black w-[max(400vh,_400vw)] h-[max(400vh,_400vw)] rounded-[50%]"></div>
            {/*<Navigation menu={menu} closeCallback={() => setBurgerActive(false)} active={activeMenu}*/}
            {/*            directions={directions} contacts={contacts}></Navigation>*/}
        </>
    )
}

export default Header;
