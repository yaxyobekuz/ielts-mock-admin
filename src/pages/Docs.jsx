import docs from "@/data/docs";

const Docs = () => {
  return (
    <div className="container pt-8 pb-20 space-y-6">
      {/* Title */}
      <h1>Qo'llanmalar</h1>

      {/* Docs */}
      <div className="space-y-12">
        {docs.map(({ title, description, videoUrl }, index) => (
          <section key={title} className="relative">
            {/* Title */}
            <div className="sticky top-14 z-10 py-1.5 bg-white">
              <h2 className="text-2xl font-medium">
                {index + 1}. {title}
              </h2>
            </div>

            {/* Description */}
            {description && (
              <p className="mt-1.5 text-gray-500 text-lg">
                {description}
              </p>
            )}

            {/* Video */}
            <video
              controls
              className="w-full h-[512px] bg-gray-100 mt-6 rounded-3xl"
            >
              <source src={videoUrl} type="video/mp4" />
              Brauzeringiz ushbu video tegini qo'llab-quvvatlamaydi.
            </video>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Docs;
