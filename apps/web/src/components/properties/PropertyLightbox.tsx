import { Dialog } from "@headlessui/react";

interface Props {
  open: boolean;
  image: string;
  onClose: () => void;
}

export function PropertyLightbox({ open, image, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="
        fixed
        inset-0
        bg-black/90
       "
      />

      <div
        className="
        fixed
        inset-0
        flex
        items-center
        justify-center
       "
      >
        <img
          src={image}
          className="
         max-h-[90vh]
         max-w-[90vw]
        "
        />
      </div>
    </Dialog>
  );
}
