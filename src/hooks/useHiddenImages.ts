
export const useHiddenImages = () => {
  const hideImage = (imageId: string) => {
    const hiddenImages = JSON.parse(localStorage.getItem('hidden_images') || '[]');
    if (!hiddenImages.includes(imageId)) {
      hiddenImages.push(imageId);
      localStorage.setItem('hidden_images', JSON.stringify(hiddenImages));
    }
  };

  const isImageHidden = (imageId: string): boolean => {
    const hiddenImages = JSON.parse(localStorage.getItem('hidden_images') || '[]');
    return hiddenImages.includes(imageId);
  };

  return {
    hideImage,
    isImageHidden,
  };
};
