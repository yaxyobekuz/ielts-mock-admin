import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  open,
  close,
  updateData,
  updateLoading,
} from "@/store/features/modalSlice";

const useModal = (name) => {
  const dispatch = useDispatch();

  const modal = useSelector((state) => state.modal[name]) || {
    data: null,
    isOpen: false,
    isLoading: false,
  };

  const openModal = useCallback(
    (data = null, modalName = name) => {
      dispatch(open({ modal: modalName, data }));
    },
    [dispatch, name]
  );

  const closeModal = useCallback(
    (data = null, modalName = name) => {
      dispatch(close({ modal: modalName, data }));
    },
    [dispatch, name]
  );

  const updateModalLoading = useCallback(
    (value) => {
      dispatch(updateLoading({ modal: name, value }));
    },
    [dispatch, name]
  );

  const updateModalData = useCallback(
    (data) => {
      dispatch(updateData({ modal: name, data }));
    },
    [dispatch, name]
  );

  return {
    ...modal,
    dispatch,
    openModal,
    closeModal,
    updateModalData,
    updateModalLoading,
  };
};

export default useModal;
