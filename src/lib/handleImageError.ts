export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  e.currentTarget.src = '/assets/common/img_default-cover.png';
  e.currentTarget.onerror = null; // Prevent infinite loop if fallback image also fails
};
