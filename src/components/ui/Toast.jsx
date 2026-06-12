import { createPortal } from 'react-dom'
import useToastStore from '../../store/toastStore'

const Toast = () => {
  const toasts = useToastStore((s) => s.toasts)
  if (!toasts.length) return null
  return createPortal(
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">{t.message}</div>
      ))}
    </div>,
    document.body
  )
}

export default Toast
