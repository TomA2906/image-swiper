import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "./styles.css";
import { EffectCards, Mousewheel } from "swiper/modules";
import { useState, useEffect, useCallback } from "react";

const fetchUniqueUnsplashImages = async (count: number) => {
  try {
    const baseImageUrl =
      "https://source.unsplash.com/collection/495468/480x640";
    const uniqueImageUrls = new Set<string>();

    while (uniqueImageUrls.size < count) {
      const imageUrl = `${baseImageUrl}?${Date.now()}`;
      uniqueImageUrls.add(imageUrl);
    }

    return Array.from(uniqueImageUrls);
  } catch (error) {
    console.error("Error fetching Unsplash images:", error);
    return [];
  }
};

export default function App(): JSX.Element {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchUniqueUnsplashImages(10).then((images) => {
      setImageUrls(images);
    });
  }, []);

  const loadMoreImages = useCallback(() => {
    fetchUniqueUnsplashImages(10).then((images) => {
      setImageUrls((prevImages) => [...prevImages, ...images]);
    });
  }, []);

  const handleSwiperSlideChange = (swiper: Swiper) => {
    // Check if the user is on the last slide
    if (swiper.activeIndex === swiper.slides.length - 9) {
      loadMoreImages();
    }
  };

  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      loop={false}
      mousewheel={true}
      modules={[EffectCards, Mousewheel]}
      className="mySwiper"
      autoHeight={false}
      onSlideChange={(swiper) => handleSwiperSlideChange(swiper)}
    >
      {imageUrls.map((imageUrl, index) => (
        <SwiperSlide key={index}>
          <img src={imageUrl} alt={`Image ${index + 1}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
