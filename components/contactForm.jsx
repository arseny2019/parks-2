'use client';
import {useForm} from "react-hook-form";
import directus from "@/lib/directus";
import {createItem} from "@directus/sdk";
import {publicUserToken} from "@/helpers/directus";
import {useEffect, useState} from "react";

export default function ContactForm() {
    const [showSuccessWindow, setShowSuccessWindow] = useState(false);
    const [showErrorWindow, setShowErrorWindow] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isValid, isSubmitting, isDirty},
    } = useForm({
        mode: 'onChange'
    });

    const normalizePhoneNumber = (phoneNumber) => {
        return phoneNumber.replace(/[^0-9+]/g, '');
    };

    const phonePattern = /^(\+7|8)\d{10}$/; // Simplified after normalization

    const onSubmit = async (e) => {
        console.log('submit', e);
        try {
            await directus.request(
                createItem('user_data', {
                    name: e.name,
                    email: e.email,
                    phone: e.phone,
                    question: e.question
                }, {access_token: publicUserToken})
            );
            setShowSuccessWindow(true);
        } catch (error) {
            console.log(error);
            setShowErrorWindow(true);
        }
    }

    useEffect(() => {
        if (showSuccessWindow) {
            reset();
        }
    }, [showSuccessWindow]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
            {showSuccessWindow && <div className="h-[calc(100%_+_24px)] px-6 py-8 absolute left-0 top-0 z-10 rounded-3xl bg-main-blue text-white
            md:pl-8 md:pr-16 md:py-10
            lg:py-12
            xl:py-10
            ">
                <h5 className="text-[28px] leading-[34px] font-roboto-condensed uppercase
                md:text-[36px] md:leading-[43px]
                xl:text-[40px] xl:leading-[48px]
                ">Форма успешно<br/>отправлена</h5>
                <p className="mt-6 text-secondary-white
                text-[16px] leading-[19px]
                md:text-[18px] md:leading-[22px]
                ">Спасибо за обращение! Мы свяжемся с вами в ближайшее время!</p>
                <button onClick={() => setShowSuccessWindow(false)} className="font-[500] leading-[150%] bg-white text-main-black
                px-6 py-4 text-[16px] mt-8 rounded-[28px]
                md:py-5 md:mt-10 md:rounded-[32px]
                ">Отлично!
                </button>
            </div>}
            {showErrorWindow && <div className="h-[calc(100%_+_24px)] px-6 py-8 absolute left-0 top-0 z-10 rounded-3xl bg-error-red text-white
            md:pl-8 md:pr-16 md:py-10
            lg:py-12
            xl:py-10
            ">
                <h5 className="text-[28px] leading-[34px] font-roboto-condensed uppercase
                md:text-[36px] md:leading-[43px]
                xl:text-[40px] xl:leading-[48px]
                ">Возникла Проблема при отправке формы</h5>
                <button onClick={() => setShowErrorWindow(false)} className="font-[500] leading-[150%] bg-white text-main-black
                px-6 py-4 text-[16px] mt-8 rounded-[28px]
                md:py-5 md:mt-10 md:rounded-[32px]
                ">Попробовать еще раз
                </button>
            </div>}
            {(!showSuccessWindow && !showErrorWindow) && <><div className="grid grid-cols-1
                            gap-y-4
                            md:gap-y-6">
                <input
                    {...register('phone', {
                        required: true,
                        onChange: (e) => {
                            const normalizedValue = normalizePhoneNumber(e.target.value);
                            setValue('phone', normalizedValue);
                        },
                        pattern: {
                            value: phonePattern,
                            message: 'Invalid phone number',
                        },
                    })
                    }
                    className="block p-5 bg-input-bg focus:bg-input-bg-focus rounded-[16px] placeholder:text-placeholder-black leading-[150%] text-main-black
                    text-[16px] focus:border focus:border-input-bg-focus-border focus:p-[19px]
                    xl:text-[18px]"
                    placeholder="Телефон*" type="text" name="phone"/>
                <input
                    {...register('email', {
                        required: true,
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                    className="block p-5 bg-input-bg focus:bg-input-bg-focus rounded-[16px] placeholder:text-placeholder-black leading-[150%] text-main-black
                    text-[16px] focus:border focus:border-input-bg-focus-border focus:p-[19px]
                    xl:text-[18px]"
                    placeholder="Email*" type="text" name="email"/>
                <input
                    {...register('name')}
                    className="block p-5 bg-input-bg focus:bg-input-bg-focus rounded-[16px] placeholder:text-placeholder-black leading-[150%] text-main-black
                    text-[16px] focus:border focus:border-input-bg-focus-border focus:p-[19px]
                    xl:text-[18px]"
                    placeholder="Ваше имя" type="text" name="name"/>
                <textarea
                    {...register('question')}
                    maxLength={512}
                    className="resize-none h-[120px]
                    block p-5 bg-input-bg focus:bg-input-bg-focus rounded-[16px] placeholder:text-placeholder-black leading-[150%] text-main-black
                    text-[16px] focus:border focus:border-input-bg-focus-border focus:p-[19px]
                    xl:text-[18px]"
                    placeholder="Расскажите о вашем запросе" name="question" rows="4"></textarea>
            </div>

            <div className="mt-8 md:mt-10">
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting || !isDirty}
                    className="rounded-[32px] w-full text-center bg-background-black block font-[500] py-4 disabled:cursor-not-allowed disabled:bg-[rgba(10,_10,_10,_0.5)] text-[16px] leading-6 text-white">Отправить
                </button>
                <p className="mt-4 text-[12px] leading-[125%] text-placeholder-black">Нажимая кнопку «Отправить», вы
                    даете согласие на <span className="text-secondary-black">обработку персональных данных</span></p>
            </div></>}
        </form>
    )
}
