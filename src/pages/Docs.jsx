import docs from "@/data/docs";

const Docs = () => {
  return (
    <div className="container pt-8 pb-20 space-y-6">
      {/* Title */}
      <h1>Qo'llanmalar</h1>

      {/* Docs */}
      {docs.map(({ title, description, videoUrl }) => (
        <section key={title} className="relative">
          {/* Title */}
          <div className="sticky top-14 z-10 py-1.5 bg-white">
            <h2 className="max-w-3xl text-2xl font-medium">{title}</h2>
          </div>

          {/* Description */}
          {description && (
            <p className="max-w-3xl mt-1.5 text-gray-500 text-lg">
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
  );
};

export default Docs;
