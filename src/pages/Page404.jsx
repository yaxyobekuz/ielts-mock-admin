// Components
import PageInfo from "@/components/PageInfo";

const Page404 = () => {
  return (
    <div className="py-12">
      <PageInfo
        title="Sahifa topilmadi"
        description="Ushbu sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin."
        links={{
          primary: { to: "/", body: "Bosh sahifa" },
          secondary: { to: -1, body: "Ortga qaytish" },
        }}
      />
    </div>
  );
};

export default Page404;
