export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  e.currentTarget.src = '/images/cover.png';
  e.currentTarget.onerror = null; // Prevent infinite loop if fallback image also fails
};
