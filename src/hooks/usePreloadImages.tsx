import { useEffect, useState } from 'react';

export const usePreloadImages = (imageSrcs: string[]) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const imagePromises = imageSrcs.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        if (isMounted) {
          setImagesLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
        if (isMounted) {
          setImagesLoaded(true); // Still set to true to show images even if preload fails
        }
      });

    return () => {
      isMounted = false;
    };
  }, [imageSrcs]);

  return imagesLoaded;
};
