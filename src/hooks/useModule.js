import { useSelector, useDispatch } from "react-redux";
import {
  addModulePart,
  setModuleData,
  updateModuleData,
  updateModulePart,
  addModuleSection,
  updateModuleSection,
} from "../store/features/moduleSlice";

// Custom hook for accessing store and dispatch
const useModule = (module, moduleId) => {
  const dispatch = useDispatch();

  // Get entire state
  const getModuleData = () => {
    return useSelector((state) => {
      const data = state.module[module];
      return data ? data[moduleId] : null;
    });
  };

  // Add module part
  const setModule = (data, id = moduleId, type = module) => {
    dispatch(setModuleData({ type, id, data }));
  };

  // Add module part
  const updateModule = (data, id = moduleId, type = module) => {
    dispatch(updateModuleData({ type, id, data }));
  };

  // Add module part
  const addPart = (data) => dispatch(addModulePart(data));

  // Add section
  const addSection = (data) => dispatch(addModuleSection(data));

  // Update section
  const updateSection = (partNumber, data, sectionIndex) => {
    dispatch(
      updateModuleSection({
        data,
        sectionIndex,
        type: module,
        id: moduleId,
        partNumber: parseInt(partNumber),
      })
    );
  };

  // Update part
  const updatePart = (partNumber, data) => {
    dispatch(
      updateModulePart({
        data,
        type: module,
        id: moduleId,
        partNumber: parseInt(partNumber),
      })
    );
  };

  return {
    addPart,
    dispatch,
    setModule,
    updatePart,
    addSection,
    updateModule,
    getModuleData,
    updateSection,
  };
};

export default useModule;
