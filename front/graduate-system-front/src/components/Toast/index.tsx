import { ToastContainer as Toast, toast, TypeOptions } from 'react-toastify'

import React from 'react'

const ToastContainer = () => (
  <Toast
    position="bottom-center"
    autoClose={10000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
)

const showSavedToast = () => toast.success('Salvo com sucesso!')
const showEditedToast = () => toast.success('Editado com sucesso!')
const showDeletedToast = () => toast.success('Deletado com sucesso!')
const showErrorToast = (message: string | React.ReactElement) => toast.error(message)
const showSuccessToast = (message: string | React.ReactElement) => toast.success(message)
const showToast = (message: string, type?: TypeOptions) => toast(message, { type })

export {
  ToastContainer,
  toast,
  showSavedToast,
  showDeletedToast,
  showErrorToast,
  showToast,
  showEditedToast,
  showSuccessToast,
}
