import React from "react";

const ChatsIcon = (props: { select: boolean }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_7_364)">
        <path
          d="M20.9 13.7V17.3L17.3 13.7H10.1C9.46348 13.7 8.85303 13.4471 8.40294 12.9971C7.95286 12.547 7.7 11.9365 7.7 11.3V2.9C7.7 1.58 8.78 0.5 10.1 0.5H22.1C22.7365 0.5 23.347 0.752856 23.7971 1.20294C24.2471 1.65303 24.5 2.26348 24.5 2.9V11.3C24.5 11.9365 24.2471 12.547 23.7971 12.9971C23.347 13.4471 22.7365 13.7 22.1 13.7H20.9ZM17.3 16.1V18.5C17.3 19.1365 17.0471 19.747 16.5971 20.1971C16.147 20.6471 15.5365 20.9 14.9 20.9H7.7L4.1 24.5V20.9H2.9C2.26348 20.9 1.65303 20.6471 1.20294 20.1971C0.752856 19.747 0.5 19.1365 0.5 18.5V10.1C0.5 8.78 1.58 7.7 2.9 7.7H5.3V11.3C5.3 12.573 5.80571 13.7939 6.70589 14.6941C7.60606 15.5943 8.82696 16.1 10.1 16.1H17.3Z"
          fill={props.select ? "#AFBDFF" : "#FFFFFF"}
        />
      </g>
      <defs>
        <clipPath id="clip0_7_364">
          <rect
            width="24"
            height="24"
            fill={props.select ? "#AFBDFF" : "#FFFFFF"}
            transform="translate(0.5 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ChatsIcon;
