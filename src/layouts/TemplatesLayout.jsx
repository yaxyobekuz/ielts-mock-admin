// Components
import Nav from "@/components/Nav";

// Router
import { Outlet } from "react-router-dom";

const TemplatesLayout = () => (
  <>
    <div className="flex items-center justify-center">
      <Nav
        pagePathIndex={1}
        links={[
          { label: "Tizim shablonlari", link: `templates/global` },
          { label: "Markaz shablonlari", link: `templates/non-global` },
        ]}
      />
    </div>
    <Outlet />
  </>
);

export default TemplatesLayout;
