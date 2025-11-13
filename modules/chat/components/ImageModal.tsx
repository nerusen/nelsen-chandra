import Image from "next/image";
import { IoClose as CloseIcon } from "react-icons/io5";
import { FiDownload as DownloadIcon } from "react-icons/fi";

interface ImageModalProps {
  imageSrc: string;
  onClose: () => void;
  onDownload: (imageSrc: string) => void;
}

const ImageModal = ({ imageSrc, onClose, onDownload }: ImageModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-full max-h-full p-4">
        <Image
          src={imageSrc}
          alt="Enlarged"
          width={800}
          height={800}
          className="max-w-full max-h-full object-contain"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(imageSrc);
          }}
          className="absolute top-4 right-4 bg-neutral-800 text-white p-2 rounded-full hover:bg-neutral-700 transition-colors"
        >
          <DownloadIcon size={20} />
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-neutral-800 text-white p-2 rounded-full hover:bg-neutral-700 transition-colors"
        >
          <CloseIcon size={20} />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
