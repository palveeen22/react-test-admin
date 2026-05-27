interface Props {
  id: string;
  size?: number;
  className?: string;
}

export function Icon({ id, size = 16, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <use href={`#icon-${id}`} />
    </svg>
  );
}
