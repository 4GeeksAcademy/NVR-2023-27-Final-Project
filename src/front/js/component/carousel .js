import React from "react";

export const Carousel = ({ start, end }) => {
    // Saved version

    const slides = [
        {
            content: "A stubborn sink pipe?\n A pesky hornet's nest?\nWe got you covered",
            caption: "Get a quote without registering",
            background: "rgb(1, 36, 4)",
            color: "rgb(226, 224, 157)",
            class1: "class1",
            class2: "class2",
            class3: "class3",
            image: ""
        },

        {
            content: "",
            background: "rgb(1, 36, 4)",
            color: "rgb(226, 224, 157)",
            class1: "class13",
            class2: "class14",
            class3: "class15",
            image: "https://res.cloudinary.com/dzow47vf1/image/upload/v1689634761/09%20Home%20caroussel%20Images/01_Plumber-fotor-20230717235354_fg5799.png"
        },
        {
            content: "Over 50 services\n at your doorstep,\n a click away",
            caption: "Learn more about our selection",
            background: "rgb(1, 36, 4)",
            color: "rgb(226, 224, 157)",
            class1: "class4",
            class2: "class5",
            class3: "class6",
            image: ""
        },

        {
            content: "",
            background: "#24194f",
            color: "rgb(226, 224, 157)",
            class1: "",
            class2: "",
            class3: "",
            image: "https://res.cloudinary.com/dzow47vf1/image/upload/v1689634761/09%20Home%20caroussel%20Images/02_Gaedening-fotor-20230717233631_mmqu5r.png"
        },

        {
            content: "Certified professionals,\n seasoned experts\n All at your service",
            caption: "Learn more about our vetting process",
            background: "rgb(1, 36, 4)",
            color: "rgb(226, 224, 157)",
            class1: "class4",
            class2: "class5",
            class3: "class6",
            image: ""
        },
        {
            content: "",
            background: "rgb(1, 36, 4)",
            color: "rgb(226, 224, 157)",
            class1: "",
            class2: "",
            class3: "class12",
            image: "https://res.cloudinary.com/dzow47vf1/image/upload/v1689639804/09%20Home%20caroussel%20Images/imageedit_16_5332916679_gbao3r.jpg"
        },

        {
            content: "Want extra security?\n Safeguard your services in two easy steps",
            caption: "Learn more about our safety features",
            background: "rgb(1, 36, 4)",
            color: "rgb(226, 224, 157)",
            class1: "class1",
            class2: "class2",
            class3: "class3",
            image: ""
        },
        {
            content: "\n",
            background: "rgb(27, 27, 27)",
            color: "rgb(226, 224, 157)",
            class1: "class19",
            class2: "class20",
            class3: "class21",
            image: "https://res.cloudinary.com/dzow47vf1/image/upload/v1689634762/09%20Home%20caroussel%20Images/04_Dog_walking-fotor-20230717233131_ubumvs.png"
        },
        {
            content: "In a generous mood?\n Treat a loved one to an\n at-home indulgence",
            caption: "Learn more about gifting",
            background: "rgb(1, 36, 4)",
            color: "rgb(226, 224, 157)",
            class1: "class1",
            class2: "class2",
            class3: "class3",
            image: ""
        },
        {
            content: "",
            background: "darkgreen",
            color: "purple",
            class1: "class25",
            class2: "class26",
            class3: "class27",
            image: "https://res.cloudinary.com/dzow47vf1/image/upload/v1689637897/09%20Home%20caroussel%20Images/07_massage_rlyopk.jpg"
        },

    ];

    const selectedSlides = slides.slice(start, end + 1);

    // inherited code
    let items = document.querySelectorAll('.carousel .carousel-item');
    items.forEach((el) => {
        const minPerSlide = 4;
        let next = el.nextElementSibling;
        for (let i = 1; i < minPerSlide; i++) {
            if (!next) {
                next = items[0];
            }
            let cloneChild = next.cloneNode(true);
            el.appendChild(cloneChild.children[0]);
            next = next.nextElementSibling;
        }
    });
    // inherited code

    // Pre-processing slide content

    const formatContent = (content, index) => {
        const lineBreakSequence = "\n";
        const lines = content.split(lineBreakSequence);
        return lines.map((line, lineIndex) => (
            <div key={lineIndex} className={slides[index][`class${lineIndex % 3 + 1}`]}>
                {line}
            </div>
        ));
    };


    // Main JSX 

    return (
        <>
            <div id="homeSlideCarousel" key="homeCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2100">
                <div className="carousel-inner mx-0 px-0" role="listbox">
                    {selectedSlides.map((slide, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                            <div className="col-md-3">
                                <div className="">
                                    <div className="mt-5">
                                        <div className={`slideWrapper`} style={{ height: "15rem", background: slide.background, color: slide.color }}>
                                            {slide.image !== "" ? (
                                                <img src={slide.image} className="slideImage" />
                                            ) : (
                                                <>
                                                    <div className="slideContent">{formatContent(slide.content, index)}</div>
                                                    <div className="slideCaption">
                                                        <span>
                                                            {slide.caption}
                                                        </span>
                                                        <span className="captionArrow">
                                                            <svg style={{ fill: 'rgb(226, 224, 157)' }} xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10"><path d="M686-450H160v-60h526L438-758l42-42 320 320-320 320-42-42 248-248Z"/></svg>
                                                        </span>
                                                    </div>
                                                </>

                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );

}


{/* <div className="controlsWrapper pt-6 mt-6">
    <span className="" href="#slideCarousel" role="button" data-bs-slide="prev">
        <span className="carousselPreviousControl text-success" aria-hidden="true" />
        previous
    </span>
    <span className="" href="#slideCarousel" role="button" data-bs-slide="next">
        <span className="carousselNextControl text-success" aria-hidden="true">
            next
        </span>
    </span>
</div> */}