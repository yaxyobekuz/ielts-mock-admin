import { useSelector, useDispatch } from "react-redux";
import {
  addModulePart,
  addModuleSection,
  updateModuleSection,
} from "../store/features/moduleSlice";

// Custom hook for accessing store and dispatch
const useModule = (module, moduleId) => {
  const dispatch = useDispatch();

  // Get entire state
  const getModuleData = () => {
    return useSelector((state) => state.module[module][moduleId]);
  };

  // Add module part
  const addPart = () => {
    dispatch(addModulePart({ type: module, id: moduleId }));
  };

  // Add section
  const addSection = (partNumber, sectionType) => {
    dispatch(
      addModuleSection({
        sectionType,
        type: module,
        id: moduleId,
        partNumber: parseInt(partNumber),
      })
    );
  };

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

  return { getModuleData, addPart, addSection, dispatch, updateSection };
};

export default useModule;
