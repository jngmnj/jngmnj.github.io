import { DEFAULT_NAME, DEFAULT_PICTURE } from '@/lib/constants';

const Avatar = () => {
  return (
    <div className="flex items-center gap-4">
      <img
        src={DEFAULT_PICTURE}
        className="h-10 w-10 rounded-full"
        alt={DEFAULT_NAME}
      />
      <div className="font-semibold text-gray-600">{DEFAULT_NAME}</div>
    </div>
  );
};

export default Avatar;
