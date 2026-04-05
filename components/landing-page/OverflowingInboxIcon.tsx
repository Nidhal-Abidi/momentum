export const OverflowingInboxIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Tray base */}
    <rect
      x="4"
      y="22"
      width="24"
      height="5"
      rx="2"
      fill="currentColor"
      opacity="0.15"
    />
    <rect
      x="4"
      y="22"
      width="24"
      height="5"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.4"
    />

    {/* Stack in tray */}
    <rect
      x="6"
      y="17"
      width="20"
      height="7"
      rx="1.5"
      fill="currentColor"
      opacity="0.08"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <rect
      x="6"
      y="12"
      width="20"
      height="7"
      rx="1.5"
      fill="currentColor"
      opacity="0.12"
      stroke="currentColor"
      strokeWidth="1.2"
    />

    {/* Spilling papers */}
    <rect
      x="4"
      y="8"
      width="16"
      height="6"
      rx="1.5"
      fill="currentColor"
      opacity="0.1"
      stroke="currentColor"
      strokeWidth="1.2"
      transform="rotate(-10 12 11)"
    />
    <rect
      x="12"
      y="5"
      width="16"
      height="6"
      rx="1.5"
      fill="currentColor"
      opacity="0.1"
      stroke="currentColor"
      strokeWidth="1.2"
      transform="rotate(8 20 8)"
    />

    {/* Urgency dot */}
    <circle cx="26" cy="7" r="5" fill="currentColor" />
    <text
      x="26"
      y="9.5"
      textAnchor="middle"
      fontSize="6"
      fontWeight="700"
      fill="white"
    >
      47
    </text>
  </svg>
);
