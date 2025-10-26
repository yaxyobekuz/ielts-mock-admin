const GrayCard = ({
  color,
  children,
  icon: Icon,
  list = null,
  className = "",
  title = "Title",
}) => {
  return (
    <section
      className={`flex flex-col bg-gray-100 bg-cover bg-no-repeat rounded-3xl ${className}`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-5">
        <h2 className="text-xl font-medium">{title}</h2>
        {Icon && (
          <div className="btn size-10 p-0 rounded-full bg-white backdrop-blur-sm">
            {<Icon strokeWidth={1.5} size={20} color={color} />}
          </div>
        )}
      </div>

      {/* List */}
      {list && (
        <ul className="pt-0 p-5 space-y-5">
          {list.map(({ icon, title, value }, index) => (
            <li key={index} className="flex items-center justify-between">
              {/* Title */}
              <div className="flex items-center gap-2">
                <icon.src strokeWidth={1.5} size={20} color={icon.color} />
                <h3 className="text-gray-600">{title}</h3>
              </div>

              {/* Value */}
              <span className="font-semibold">{value}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Children */}
      {children}
    </section>
  );
};

export default GrayCard;
