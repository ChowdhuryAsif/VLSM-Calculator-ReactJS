import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export const notifyWarning = (message) => {
  return (
    <div>
      {toast.warning(message, {
        position: toast.POSITION.TOP_LEFT,
      })}
    </div>
  );
};

export const notifyError = (message) => {
  return (
    <div>
      {toast.error(message, {
        position: toast.POSITION.TOP_LEFT,
      })}
    </div>
  );
};

export const notifyErrorBC = (message) => {
  return (
    <div>
      {toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
      })}
    </div>
  );
};

export const notifySuccess = (message) => {
  return (
    <div>
      {toast.success(message, {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1500,
      })}
    </div>
  );
};
