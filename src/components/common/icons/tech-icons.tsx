import React from "react";

export function JavaScriptIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="16" fill="#F7DF1E" />
      <path d="M67.3 103c2.7 4.5 6.3 8 13.5 8 5.7 0 9.3-2.7 9.3-6.6 0-4.5-3.6-6.2-9.6-8.8l-3.3-1.4c-9.6-4.1-15.9-9.2-15.9-19.9 0-10 7.7-17.5 19.8-17.5 8.6 0 14.8 3 19.3 10.8l-9.1 5.8c-2.4-4.2-5-6-9.8-6-4.5 0-7.5 2.7-7.5 5.8 0 4.1 2.7 5.7 8.7 8.3l3.3 1.4c11.4 4.9 17.1 9.9 17.1 20.7 0 11.8-9.1 18.5-22.1 18.5-12.2 0-19.8-5.8-23.7-14.1l10-5.8zm-34-1c2.4 4.2 5.5 7.6 11.2 7.6 5.8 0 9.5-2.3 9.5-11.4V50.7h12.5v47.7c0 15.6-9.1 22.3-21.9 22.3-10.4 0-17.1-5.3-20.7-13.1l9.4-5.6z" fill="#000000" />
    </svg>
  );
}

export function NodeJSIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M64 12.8L17.2 39.8v54l46.8 27 46.8-27v-54L64 12.8z" fill="#339933" />
      <path d="M64 24.3l36.8 21.2v42.5L64 109.3 27.2 88V45.5L64 24.3z" fill="#339933" />
      <path d="M64 53.5l18 10.4v20.8L64 95.1 46 84.7V63.9L64 53.5z" fill="#FFFFFF" />
    </svg>
  );
}

export function PythonIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M62.6 10.2c-27 0-25.3 11.7-25.3 11.7l.1 12.2h25.8v3.7H27.5C10.7 37.8 10 50.1 10 50.1s-.8 14.8 0 24.5c.9 11.5 10 12.2 10 12.2h6.1v-8.7c0-12.7 11.1-12.2 11.1-12.2h25.5s10.6.2 10.6-10.3V25.3c0-10.2-10.7-15.1-20.7-15.1zm-10.9 7.7c2.3 0 4.1 1.8 4.1 4.1 0 2.3-1.8 4.1-4.1 4.1-2.3 0-4.1-1.8-4.1-4.1 0-2.3 1.8-4.1 4.1-4.1z" fill="#3776AB" />
      <path d="M65.4 117.8c27 0 25.3-11.7 25.3-11.7l-.1-12.2H64.8v-3.7h35.7c16.8 0 17.5-12.3 17.5-12.3s.8-14.8 0-24.5c-.9-11.5-10-12.2-10-12.2h-6.1v8.7c0 12.7-11.1 12.2-11.1 12.2H65.3s-10.6-.2-10.6 10.3v30.3c0 10.2 10.7 15.1 20.7 15.1zm10.9-7.7c-2.3 0-4.1-1.8-4.1-4.1 0-2.3 1.8-4.1 4.1-4.1 2.3 0 4.1 1.8 4.1 4.1 0 2.3-1.8 4.1-4.1 4.1z" fill="#FFD43B" />
    </svg>
  );
}

export function DjangoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="16" fill="#092E20" />
      <path d="M78.6 30h11v53.4c0 13.9-6.6 21.6-18.7 21.6-4.9 0-9.6-1.1-13-3.2l2.6-9.1c2.6 1.4 5.7 2.1 8.8 2.1 5.9 0 9.3-3.8 9.3-11.6V30zm-24.6 22.3v27.2c-2.4 1.4-5.7 2.2-8.7 2.2-6 0-9-3.4-9-10.1 0-7.3 4.4-11.4 11.6-11.4 2.1 0 4.3.4 6.1 1.1V52.3zm10.8 38.6V30H54v14c-2.9-1.9-6.9-2.9-11.1-2.9-12.7 0-20.9 8.2-20.9 21.1 0 13.8 7.3 21.7 19.6 21.7 4.9 0 9.1-1.3 11.9-3.4v2.7c0 7.6-4.5 11.3-12.5 11.3-4.4 0-9.1-1.2-12.5-3.3l-3 9c4.2 2.5 10.4 4 16.5 4 14.8 0 22.8-7.7 22.8-23.3zM89.6 30h-11v11h11V30z" fill="#FFFFFF" />
    </svg>
  );
}

export function HTMLIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M19.5 11.5l8.9 100 35.6 9.9 35.6-9.9 8.9-100H19.5z" fill="#E44D26" />
      <path d="M64 114l28.6-7.9 7.4-83.1H64V114z" fill="#F16529" />
      <path d="M64 54.3H45.7L44.5 41h38.3V27.8H30l3.6 40H64v-13.5zm0 32.5l-14.7-4-1-11.2H35l1.9 21.7 27.1 7.5v-14z" fill="#EBEBEB" />
      <path d="M64 54.3v13.5h16.8l-1.6 17.8-15.2 4.1v14l27.1-7.5 3.6-41.9H64z" fill="#FFFFFF" />
    </svg>
  );
}

export function CSSIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M19.5 11.5l8.9 100 35.6 9.9 35.6-9.9 8.9-100H19.5z" fill="#264DE4" />
      <path d="M64 114l28.6-7.9 7.4-83.1H64V114z" fill="#2965F1" />
      <path d="M64 54.3H45.7L44.5 41h38.3V27.8H30l3.6 40H64v-13.5zm0 32.5l-14.7-4-1-11.2H35l1.9 21.7 27.1 7.5v-14z" fill="#EBEBEB" />
      <path d="M64 54.3v13.5h16.8l-1.6 17.8-15.2 4.1v14l27.1-7.5 3.6-41.9H64z" fill="#FFFFFF" />
    </svg>
  );
}

export function NextJSIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <circle cx="64" cy="64" r="64" fill="#000000" />
      <path d="M100.3 103.8L47.5 35.5h-9v56.9h11.4V49.9l44 57.3c2.2-1.1 4.3-2.2 6.4-3.4z" fill="url(#next-gradient)" />
      <path d="M80.5 35.5h11.4v56.9H80.5z" fill="#FFFFFF" />
      <defs>
        <linearGradient id="next-gradient" x1="73" y1="35.5" x2="98" y2="103" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ReactJSIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <circle cx="64" cy="64" r="11.4" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="7" fill="none">
        <ellipse cx="64" cy="64" rx="48" ry="18" />
        <ellipse cx="64" cy="64" rx="48" ry="18" transform="rotate(60 64 64)" />
        <ellipse cx="64" cy="64" rx="48" ry="18" transform="rotate(120 64 64)" />
      </g>
    </svg>
  );
}

export function PHPIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <ellipse cx="64" cy="64" rx="60" ry="36" fill="#777BB4" />
      <path d="M43.5 50h-13l-6 28h7.5l2.4-11.2h4.5c5.3 0 9.2-2.7 10.3-8.1 1.2-5.4-1.6-8.7-5.7-8.7zm-4.7 10.5h-4.3l1.8-8.3h4.3c2.4 0 3.7 1.2 3.1 3.9-.5 2.6-2.5 4.4-4.9 4.4zm27.8-10.5h-7.6l-6 28h7.6l2.6-12h7.8l-2.6 12h7.6l6-28h-7.6l-2.6 12h-7.8l2.6-12zm33.5 0h-13l-6 28h7.5l2.4-11.2h4.5c5.3 0 9.2-2.7 10.3-8.1 1.2-5.4-1.6-8.7-5.7-8.7zm-4.7 10.5h-4.3l1.8-8.3h4.3c2.4 0 3.7 1.2 3.1 3.9-.5 2.6-2.5 4.4-4.9 4.4z" fill="#FFFFFF" />
    </svg>
  );
}

export function LaravelIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M112.5 35.8L72.2 12.6c-2.4-1.4-5.4-1.4-7.8 0L24.1 35.8c-2.4 1.4-3.9 4-3.9 6.8v46.4c0 2.8 1.5 5.4 3.9 6.8l40.3 23.2c2.4 1.4 5.4 1.4 7.8 0l40.3-23.2c2.4-1.4 3.9-4 3.9-6.8V42.6c0-2.8-1.5-5.4-3.9-6.8z" fill="#FF2D20" />
      <path d="M64.3 25.5L35.4 42.1v33.3l28.9 16.7 28.9-16.7V42.1L64.3 25.5z" fill="#FFFFFF" />
    </svg>
  );
}

export function FigmaIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M43 124c11.6 0 21-9.4 21-21V82H43c-11.6 0-21 9.4-21 21s9.4 21 21 21z" fill="#0ACF83" />
      <path d="M22 61c0-11.6 9.4-21 21-21h21v42H43c-11.6 0-21-9.4-21-21z" fill="#A259FF" />
      <path d="M22 19c0-11.6 9.4-21 21-21h21v42H43c-11.6 0-21-9.4-21-21z" fill="#F24E1E" />
      <path d="M64-2h21c11.6 0 21 9.4 21 21s-9.4 21-21 21H64V-2z" fill="#FF7262" />
      <path d="M106 61c0 11.6-9.4 21-21 21s-21-9.4-21-21 9.4-21 21-21 21 9.4 21 21z" fill="#1ABCFE" />
    </svg>
  );
}

export function WordpressIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <circle cx="64" cy="64" r="56" fill="#21759B" />
      <path d="M15.4 64c0 21.6 14.1 40 33.7 46.5L20.8 38.6C17.3 46 15.4 54.8 15.4 64zm82.8-3.4c0-7-2.5-11.9-4.7-15.8-2.9-4.7-5.6-8.6-5.6-13.3 0-5.2 3.9-10.1 9.4-10.1.2 0 .5 0 .8.1-9.2-8.5-21.5-13.7-35.1-13.7-17.7 0-33.1 8.8-42.3 22.2 1.4.1 2.8.1 4 .1 6.5 0 16.5-.8 16.5-.8 3.4-.2 3.8 4.7.4 5 0 0-3.4.4-7.2.6l23 68.4 13.8-41.4-9.8-27c-3.4-.2-6.6-.6-6.6-.6-3.4-.2-3-5.2.4-5 0 0 10.3.8 16.3.8 6.5 0 16.5-.8 16.5-.8 3.4-.2 3.8 4.7.4 5 0 0-3.4.4-7.2.6l22.8 67.8 6.3-21c2.7-8.4 4.7-14.4 4.7-19.6zm-34 50c3.9.7 8 1.1 12.1 1.1 11 0 21.3-3.6 29.6-9.7L82.1 41.5 64.2 110.6zm42.7-22c7.4-9.2 11.9-20.9 11.9-33.6 0-11-3.3-21.2-9-29.8v1.7c0 7.8-1.5 17.5-6 28.5L86.9 88.6z" fill="#FFFFFF" />
    </svg>
  );
}

export function FlutterIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M72.8 10.7L25 58.5l14.8 14.8L102.4 10.7H72.8z" fill="#47C5FB" />
      <path d="M102.4 55.1L72.8 84.7l29.6 29.6h29.6L102.4 84.7l29.6-29.6h-29.6z" fill="#47C5FB" />
      <path d="M72.8 84.7l14.8-14.8 14.8 14.8-14.8 14.8z" fill="#0A5695" />
    </svg>
  );
}

export function IOSIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M88.7 67.2c.2 17.7 15.5 23.6 15.7 23.7-.1.5-2.5 8.5-8.1 16.8-4.9 7.1-10 14.2-18 14.3-7.9.1-10.4-4.7-19.4-4.7-9.1 0-11.9 4.6-19.3 4.9-7.7.3-13.6-7.7-18.6-14.9-10.1-14.6-17.9-41.4-7.5-59.5 5.2-9 14.4-14.7 24.5-14.9 7.7-.1 14.9 5.2 19.5 5.2 4.6 0 13.3-6.4 22.4-5.5 3.8.2 14.5 1.5 21.4 11.6-1 1-12.7 7.4-12.6 23zM74.3 27.2c4.1-5 6.9-12 6.1-19-6 0-13.3 4.1-17.6 9.1-3.8 4.4-7.1 11.6-6.2 18.4 6.7.5 13.6-3.5 17.7-8.5z" fill="#000000" />
    </svg>
  );
}

export function DartIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M26.4 12.8L12.8 26.4v44.8L26.4 84.8h44.8L84.8 71.2V26.4L71.2 12.8H26.4z" fill="#0175C2" />
      <path d="M48.8 35.2L35.2 48.8v44.8L48.8 107.2h44.8l13.6-13.6V48.8L93.6 35.2H48.8z" fill="#02569B" />
      <path d="M71.2 57.6L57.6 71.2v44.8L71.2 129.6h44.8l13.6-13.6V71.2L116 57.6H71.2z" fill="#29B6F6" />
    </svg>
  );
}

export function SwiftIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M106.8 11.2c-15.6 15.6-32.3 35.2-41.5 56-9.8-12.3-25.1-23.7-41-26.6 14.8 15 26.9 31.9 33.1 50.8-17.3-8.8-37.4-9.3-52.4-.2 25.1 12.7 54.4 11.8 77.2-2.3 18.6-11.5 30.6-31.5 35.3-51.5-3.5-8.5-6.6-17.6-10.7-26.2z" fill="#F05138" />
    </svg>
  );
}

export function KotlinIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M118 10H10v108l54-54L118 10z" fill="url(#kotlin-grad1)" />
      <path d="M64 64L10 118h108L64 64z" fill="url(#kotlin-grad2)" />
      <defs>
        <linearGradient id="kotlin-grad1" x1="10" y1="10" x2="118" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E44857" />
          <stop offset="1" stopColor="#C711E1" />
        </linearGradient>
        <linearGradient id="kotlin-grad2" x1="10" y1="118" x2="118" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7F52FF" />
          <stop offset="1" stopColor="#C711E1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ReactNativeIcon({ className = "h-8 w-8" }: { className?: string }) {
  return <ReactJSIcon className={className} />;
}

export function MongoDBIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M63.8 10s-2.1 1.7-4 8.7C55 35.9 41.7 56 31.8 75.3c-7.9 15.4-8.8 28-3.4 36.1 5 7.5 15.3 9.4 26.6 6 4.9-1.5 7.7-4.1 8.8-8V10.1l-.3-.1zm.4.1v99.2c1.1 3.9 3.9 6.5 8.8 8 11.3 3.4 21.6 1.5 26.6-6 5.4-8.1 4.5-20.7-3.4-36.1-9.9-19.3-23.2-39.4-28-56.6-1.9-7-4-8.5-4-8.5z" fill="#47A248" />
    </svg>
  );
}

export function MySQLIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M64 12c-28.7 0-52 23.3-52 52s23.3 52 52 52 52-23.3 52-52-23.3-52-52-52zm25 71.5c-4.2 3.1-9.5 4.8-15.2 4.8-12.7 0-23-9.4-23-21 0-11.6 10.3-21 23-21 5.7 0 11 1.7 15.2 4.8v8.3c-3.9-3.2-8.9-5.1-14.2-5.1-9.3 0-16.8 6.7-16.8 15s7.5 15 16.8 15c5.3 0 10.3-1.9 14.2-5.1v7.3z" fill="#00758F" />
    </svg>
  );
}

export function PostgresIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M64 12C35.3 12 12 35.3 12 64s23.3 52 52 52 52-23.3 52-52S92.7 12 64 12zm22.4 69.4c-4.3 4.3-10.2 7.1-16.7 7.5l-2.1-7.8c4.3-.3 8.2-2.1 11-4.9 3.8-3.8 5.4-9.3 4.5-14.7l7.7-1.3c1.4 8-1 16.2-6.4 21.6zM46.7 54.3c-1.4-8 1-16.2 6.4-21.6 4.3-4.3 10.2-7.1 16.7-7.5l2.1 7.8c-4.3.3-8.2 2.1-11 4.9-3.8 3.8-5.4 9.3-4.5 14.7l-9.7 1.7z" fill="#336791" />
    </svg>
  );
}

export function SQLiteIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="16" fill="#003B57" />
      <path d="M30 40h68v14H30V40zm0 24h68v14H30V64zm0 24h48v14H30V88z" fill="#003B57" />
      <path d="M35 45h58v4H35v-4zm0 24h58v4H35v-4zm0 24h38v4H35v-4z" fill="#409FFF" />
    </svg>
  );
}

export function RedisIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M18.8 45.4L64 22.8l45.2 22.6-45.2 22.6L18.8 45.4z" fill="#DC382D" />
      <path d="M18.8 62.4L64 85l45.2-22.6v17L64 102 18.8 79.4v-17z" fill="#A41E11" />
    </svg>
  );
}

export function AWSIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <rect width="128" height="128" rx="16" fill="#232F3E" />
      <path d="M43.7 65.5c-4.2.7-7.4 1.8-9.4 3.3-2.1 1.5-3.1 3.5-3.1 6 0 2.3.9 4.1 2.6 5.5 1.7 1.4 4 2.1 6.8 2.1 3.8 0 7-1.4 9.6-4.1 2.6-2.7 3.9-6 3.9-9.8v-3c-3.4 0-6.9.1-10.4.5zm19.9 22.1h-8.8v-7.1c-2.3 2.8-5.3 4.9-8.9 6.3-3.6 1.4-7.6 2.1-11.8 2.1-5.7 0-10.2-1.6-13.6-4.8-3.4-3.2-5.1-7.4-5.1-12.6 0-5.7 2.1-10 6.3-13 4.2-3 10.3-4.8 18.3-5.3l15.1-.9v-3.7c0-3.3-1.1-5.8-3.2-7.5-2.1-1.7-5.3-2.6-9.5-2.6-3.8 0-7.2.7-10.3 2.1-3.1 1.4-5.6 3.3-7.5 5.8l-5.6-6.1c3.1-3.6 7-6.3 11.7-8.1 4.7-1.8 10-2.7 15.9-2.7 7.4 0 13.1 1.7 17.1 5.1 4 3.4 6 8.5 6 15.3v27.8zm23.6-25.1c0-4.3-.9-7.5-2.7-9.6-1.8-2.1-4.5-3.2-8.1-3.2-3.4 0-6.1 1-8 3.1-1.9 2.1-2.9 5.2-2.9 9.3 0 4.2.9 7.4 2.8 9.5 1.9 2.1 4.6 3.2 8.1 3.2 3.5 0 6.2-1.1 8.1-3.2 1.8-2.1 2.7-5.1 2.7-9.1zm-30.5 0c0-6.6 1.8-11.8 5.4-15.6 3.6-3.8 8.6-5.7 15.1-5.7 6.3 0 11.3 1.9 14.9 5.7 3.6 3.8 5.4 9 5.4 15.6 0 6.7-1.8 11.9-5.4 15.7-3.6 3.8-8.6 5.7-15 5.7-6.4 0-11.4-1.9-15-5.7-3.6-3.8-5.4-9-5.4-15.7z" fill="#FF9900" />
    </svg>
  );
}

export function GoogleCloudIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M78.6 56.4H50.8v15.2h15.9c-1.4 7.2-7.5 12.5-15.9 12.5-9.6 0-17.4-7.8-17.4-17.4s7.8-17.4 17.4-17.4c4.3 0 8.2 1.6 11.2 4.2l11.4-11.4C56.6 36.1 49 33.6 40.8 33.6 24 33.6 10.4 47.2 10.4 64S24 94.4 40.8 94.4c17.5 0 29.1-12.3 29.1-29.6 0-2.8-.3-5.5-1.3-8.4z" fill="#4285F4" />
      <path d="M101.6 66.7c0-1.8-.2-3.6-.6-5.3H68.8v10.7h18.6c-.8 4.3-3.2 7.9-6.8 10.3l11 8.5c6.4-5.9 10-14.7 10-24.2z" fill="#4285F4" />
    </svg>
  );
}

export function DockerIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M119.5 59.8c-2.4-1.8-7.7-2.6-12.3-1.4-1.5-3.8-4.5-6.9-8.4-8.8l-3.3-1.6-2.2 3c-3 4.1-4.2 9.4-3.3 14.4-3.3.4-6.4 1.7-9.1 3.7H13.6c-1.6 0-3 1.3-3 3 0 14.8 5 28.5 13.9 38.6C34.3 121.9 49.3 128 66 128c31.1 0 57.2-21 61.5-50.5.4-3-.6-6.1-2.7-8.3-1.4-1.4-3.4-6.7-5.3-9.4zM24.8 50.8h13.2v13.2H24.8V50.8zm16.5 0h13.2v13.2H41.3V50.8zm16.5 0h13.2v13.2H57.8V50.8zm16.5 0h13.2v13.2H74.3V50.8z" fill="#2496ED" />
    </svg>
  );
}

export function KubernetesIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M64 10L14.5 38.6v57.1L64 124.3l49.5-28.6V38.6L64 10zm0 18.5l33.4 19.3v38.5L64 105.6 30.6 86.3V47.8L64 28.5z" fill="#326CE5" />
      <circle cx="64" cy="67" r="14" fill="#326CE5" />
    </svg>
  );
}

export function CloudflareIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M96.4 71.3c-1.1-13.8-12.6-24.6-26.6-24.6-9.5 0-17.9 5.1-22.5 12.7-2.6-1.7-5.7-2.7-9.1-2.7-9.1 0-16.5 7.4-16.5 16.5 0 1.2.1 2.3.4 3.4-8 1.8-14 8.9-14 17.4 0 9.8 8 17.8 17.8 17.8h70.7c8.8 0 16-7.2 16-16 0-8.2-6.2-15-14.2-15.9l-2-8.6z" fill="#F38020" />
    </svg>
  );
}

export function DigitalOceanIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M64 12C35.3 12 12 35.3 12 64s23.3 52 52 52c23.6 0 43.4-15.7 49.6-37.3H90.8c-4.8 12.3-16.7 21-30.8 21-18.2 0-33-14.8-33-33s14.8-33 33-33c14.1 0 26 8.7 30.8 21h22.8C107.4 27.7 87.6 12 64 12z" fill="#0080FF" />
    </svg>
  );
}
