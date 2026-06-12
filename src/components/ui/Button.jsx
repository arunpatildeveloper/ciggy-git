/*
  Button variants:
  "primary"   — burgundy bg
  "secondary" — transparent, light border
  "ghost"     — text only
  "light"     — dark bg (for off-white sections)
*/
import styles from './Button.module.css'

const Button = ({
  children, variant = 'primary', size = 'md',
  fullWidth = false, disabled = false,
  type = 'button', onClick, className = '', ...props
}) => {
  const cls = [
    styles.btn, styles[variant], styles[size],
    fullWidth ? styles.full : '',
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button
