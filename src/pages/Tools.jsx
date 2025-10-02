// Router
import { Link } from "react-router-dom";

// Icons
import { ArrowUpRight } from "lucide-react";

// Backgrounds
import pdfViewBg from "@/assets/backgrounds/pdf-view.webp";

const tools = [
  {
    title: "PDF ochuvchi",
    description: "PDF fayllarni ochish uchun asbob",
    image: pdfViewBg,
    link(path) {
      return `/tools/${path}`;
    },
  },
];

const Tools = () => {
  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <h1>Asboblar</h1>

      {/* Tools */}
      <ul className="grid grid-cols-4 gap-5">
        {tools.map(({ image, title, link, description }, index) => {
          return (
            <li
              key={index}
              style={{ backgroundImage: `url(${image})` }}
              className="flex flex-col relative overflow-hidden w-full h-auto aspect-square bg-cover bg-center bg-no-repeat bg-gray-100 rounded-3xl"
            >
              <div className="flex items-center justify-end p-5">
                {/* Link */}
                <div className="btn size-10 p-0 rounded-full bg-white backdrop-blur-sm">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Bottom */}
              <div className="w-full bg-gradient-to-b from-transparent to-black/80 mt-auto p-5 space-y-3">
                <h2 className="text-xl font-medium text-white">{title}</h2>
                <p className="text-gray-300">{description}</p>
              </div>

              {/* Link */}
              <Link
                to={link("pdf-viewer")}
                className="block absolute z-0 -top-5 inset-0 size-full rounded-3xl"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tools;
