"use client";

import {useEffect} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import Script from "next/script";

const YM_COUNTER_ID = 101876794;

export const useYandexMetrika = (id) => {
    const hit = (url, options) => {
        ym(id, "hit", url, options);
    };

    const reachGoal = (
        target,
        params,
        callback,
        ctx,
    ) => {
        if (enabled) {
            ym(id, "reachGoal", target, params, callback, ctx);
        } else {
            console.log(`%c[YandexMetrika](reachGoal)`, `color: orange`, target);
        }
    };

    return {hit, reachGoal};
};

const YandexMetrikaInitializer = ({id, initParameters}) => {
    /* eslint-disable @next/next/no-img-element */
    return (
        <>
            <Script type="text/javascript" id={`ym_${id}`}>
                {`(function (m, e, t, r, i, k, a) {
  m[i] =
    m[i] ||
    function () {
      (m[i].a = m[i].a || []).push(arguments);
    };
  m[i].l = 1 * new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) {
      return;
    }
  }
  (k = e.createElement(t)),
    (a = e.getElementsByTagName(t)[0]),
    (k.async = 1),
    (k.src = r),
    a.parentNode.insertBefore(k, a);
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(${id}, "init", ${JSON.stringify(initParameters)});`}
            </Script>
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${id}`}
                        style={{position: "absolute", left: "-9999px;"}}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    );
};


export const YandexMetrikaContainer = ({enabled}) => {
    const pathname = usePathname();
    const search = useSearchParams();
    const {hit} = useYandexMetrika(YM_COUNTER_ID);

    useEffect(() => {
        hit(`${pathname}${search.size ? `?${search}` : ""}${window.location.hash}`);
    }, [hit, pathname, search]);

    if (!enabled) return null;

    return (
        <YandexMetrikaInitializer
            id={YM_COUNTER_ID}
            initParameters={{
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true
            }}
        />
    );
};
