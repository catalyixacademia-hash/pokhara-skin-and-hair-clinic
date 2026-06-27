import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline-frost' | 'ghost' | 'whatsapp';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  href?: string;
  external?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  'outline-frost': 'btn-outline-frost',
  ghost: 'btn-ghost',
  whatsapp: 'btn-whatsapp',
};

export default function Button({
  variant = 'primary',
  className,
  href,
  external,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(variantClass[variant], className);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={props.type ?? 'button'} className={classes} {...props}>
      {children}
    </button>
  );
}
