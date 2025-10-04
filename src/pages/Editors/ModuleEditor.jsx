// React
import { useEffect } from "react";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import Nav from "@/components/Nav";
import Input from "@/components/form/Input";
import Button from "@/components/form/Button";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Router
import { Link, useParams } from "react-router-dom";

// Hooks
import useModule from "@/hooks/useModule";
import useObjectState from "@/hooks/useObjectState";

// Icons
import { ArrowLeft, Clock, Music } from "lucide-react";

const ModuleEditor = () => {
  const { testId, module } = useParams();
  const isListening = module === "listening";
  const { getModuleData, updateModule } = useModule(module, testId);
  const { duration: initialDuration, audios: initialAudios } =
    getModuleData() || {};

  const { audios, isloading, duration, setField } = useObjectState({
    isloading: false,
    audios: initialAudios,
    duration: initialDuration,
  });

  const handleUpdateDuration = (e) => {
    e.preventDefault();
    if (isloading) return;
    setField("isloading", true);

    testsApi
      .updateModule(testId, module, { duration })
      .then(({ code, updates, module }) => {
        if (code !== "moduleUpdated") throw new Error();
        updateModule(updates, testId, module);
        toast.success("Vaqt muvaffaqiyatli yangilandi");
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setField("isloading", false));
  };

  useEffect(() => {
    setField("duration", initialDuration);
  }, [module]);

  return (
    <div>
      {/* Top */}
      <Navbar testId={testId} module={module} />

      <main className="container pt-8">
        <div className="flex gap-5 justify-center">
          {/* Time */}
          <section className="max-w-md w-full bg-gray-50 rounded-3xl p-5">
            <form onSubmit={handleUpdateDuration} className="space-y-5">
              {/* Top */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">
                  <span className="capitalize">{module}</span> uchun vaqt
                </h2>
                <Clock size={20} className="stroke-gray-500" />
              </div>

              {/* Main */}
              <Input
                border
                min={5}
                step={1}
                size="lg"
                required
                max={180}
                type="number"
                value={duration}
                disabled={isloading}
                placeholder="Minutlarda"
                name={`${module}-duration`}
                onChange={(value) =>
                  setField("duration", extractNumbers(value))
                }
              />

              <Button disabled={isloading} size="lg" className="w-full">
                Yangilash{isloading && "..."}
              </Button>
            </form>
          </section>

          {/* Audio */}
          {isListening && (
            <section className="max-w-md w-full bg-gray-50 rounded-3xl p-5">
              {/* Top */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Audiolar</h2>
                <Music size={20} className="stroke-gray-500" />
              </div>

              {/* Main */}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

const Navbar = ({ testId, module }) => {
  const to = (m) => `tests/${testId}/edit/${m}`;

  return (
    <div className="flex items-center gap-3.5 sticky top-0 inset-x-0 z-20 container h-14 bg-white">
      <Link
        to={`/tests/${testId}/preview/${module}/1`}
        className="btn shrink-0 size-11 bg-gray-100 p-0 rounded-full hover:bg-gray-200"
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
      </Link>

      <Nav
        fullSizeBtn
        pagePathIndex={3}
        className="w-full"
        links={[
          { label: "Listening", link: to("listening") },
          { label: "Reading", link: to("reading") },
          { label: "Writing", link: to("writing") },
        ]}
      />
    </div>
  );
};

export default ModuleEditor;
