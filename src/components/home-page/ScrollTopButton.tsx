"use client";

export default function ScrollTopButton() {
  return (
    <button
      className="fixed z-40 bottom-[30px] right-[30px] bg-primary rounded-full w-14 h-14 flex"
      onClick={() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }}
    >
      <svg
        className="m-auto"
        width={50}
        height={50}
        viewBox="0 0 512 512"
        enableBackground="new 0 0 512 512"
      >
        <path
          d="m396.6 352 19.4-20.7L256 160 96 331.3l19.3 20.7L256 201.5z"
          fill="#ffffff"
        ></path>
      </svg>
    </button>
  );
}
