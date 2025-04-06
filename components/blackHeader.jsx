'use client';
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import Navigation from "@/components/navigation";
import Link from "next/link";

const BlackHeader = ({directions, contacts, menu}) => {
    const [burgerActive, setBurgerActive] = useState(false);
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const blackCircleRef = useRef(null);
    const headerInnerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [heightOnHide, setHeightOnHide] = useState(0);
    const [activeMenu, setActiveMenu] = useState(false);

    if (typeof window !== 'undefined') {
        useEffect(() => {
            document.querySelectorAll('.logo-image').forEach(el => {
                if (window.location.pathname === '/') {
                    el.classList.remove('hover:opacity-70', 'duration-200');
                } else {
                    el.classList.add('hover:opacity-70', 'duration-200');
                }
            });
        }, [window.location.pathname]);
    }

    useEffect(() => {
        setHeaderHeight(headerRef.current.getBoundingClientRect().height);

        function handleScroll() {
            if (heightOnHide) {
                if (window.scrollY > heightOnHide - 90) {
                    headerRef.current?.classList.add('opacity-0', 'invisible');
                } else {
                    headerRef.current?.classList.remove('opacity-0', 'invisible');
                }
            }
        }
        document.addEventListener('scroll', handleScroll);

        return () => {
            console.log('try to remove scroll listener from blackHeader');
            document.removeEventListener('scroll', handleScroll);
        }

    }, [containerRef, heightOnHide]);

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
        const blackWrapper = document.querySelector('#blackWrapper');
        if (blackWrapper.offsetTop) {
            setHeightOnHide(blackWrapper.offsetTop);
        }

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
            <header ref={headerRef}
                    className="duration-300 w-full h-[88px] xl:h-[90px] fixed top-0 left-0 z-10 backdrop-blur-[50px] bg-[rgba(255,_255,_255,_0.6)]">
                <div ref={blackCircleRef} className="absolute right-0 top-0 scale-0 z-10 origin-center
                translate-x-[50%] translate-y-[-50%] duration-500 bg-main-black w-[max(400vh,_400vw)] h-[max(400vh,_400vw)] rounded-[50%]"></div>
                <Navigation menu={menu} closeCallback={() => setBurgerActive(false)} active={activeMenu}
                            directions={directions} contacts={contacts}></Navigation>
                <div className="absolute left-0 top-0 w-full">
                    <div ref={headerInnerRef} className="mx-auto flex justify-between items-center duration-200
                    2xl:max-w-[1680px] 3xl:pl-[120px] 3xl:pr-[120px]
                    lg:pr-10 lg:pl-10
                    md:pr-6
                    pl-6 pt-8 pr-4 pb-4
                    ">
                        <Link href="/">
                            <Image width={208} height={42} src="/logo-black.svg"
                                   className="logo-image h-[42px] w-[208px]" alt="Logo"></Image>
                        </Link>

                        <div className="text-main-black">
                            <div onClick={() => setBurgerActive(!burgerActive)}
                                 className="cursor-pointer relative burger-container flex justify-center items-center w-10 h-10">
                    <span className="burger">
                        <span className="burger-line"></span>
                    </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default BlackHeader;
