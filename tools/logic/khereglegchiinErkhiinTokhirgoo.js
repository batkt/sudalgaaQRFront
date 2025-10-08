import { useRouter } from "next/router";
import _ from "lodash";
import { FileDoneOutlined } from "@ant-design/icons";

export const Erkh = {
  superAdmin: "superAdmin",
  Admin: "Admin",
  Boss: "Boss",
  userAdmin: "userAdmin",
};

const khereglegchiinErkh = [
  {
    erkh: "superAdmin",
    tsonkhnuud: [
      "/application/khariultKharakh",
      "/application/sudalgaa",
      "/khuudsuud/ajiltniiJagsaalt",
      "/khuudsuud/burtgekh",
      "/dashboard/analytic",
    ],
  },
  {
    erkh: "Admin",
    tsonkhnuud: [
      "/application/khariultKharakh",
      "/application/sudalgaa",
      "/khuudsuud/ajiltniiJagsaalt",
      "/khuudsuud/burtgekh",
      "/dashboard/analytic",
    ],
  },
  {
    erkh: "Boss",
    tsonkhnuud: [
      "/application/khariultKharakh",
      "/application/sudalgaa",
      "/khuudsuud/ajiltniiJagsaalt",
      "/khuudsuud/burtgekh",
      "/dashboard/analytic",
    ],
  },
  {
    erkh: "userAdmin",
    tsonkhnuud: [
      "/application/khariultKharakh",
      "/application/sudalgaa",
      "/khuudsuud/ajiltniiJagsaalt",
      "/khuudsuud/burtgekh",
      "/dashboard/analytic",
    ],
  },
];

export function ekhniiTsonkhruuOchyo(ajiltan) {
  if (ajiltan?.erkh === "superAdmin")
    window.location.href = "/dashboard/analytic";
  else if (ajiltan.erkh === "Admin" || ajiltan.erkh === "Boss") {
    window.location.href = "/dashboard/analytic";
  } else if (ajiltan.tsonkhniiErkhuud[0] === "/dashboard/analytic") {
    window.location.href = "/dashboard/analytic";
  } else window.location.href = ajiltan.tsonkhniiErkhuud[0];
}

export const khuudasnuud = [
  {
    ner: "ГРАФИК ТАЙЛАН",
    khuudasniiNer: "analytic",
    href: "/dashboard/analytic",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
  {
    ner: "Захиалга",
    khuudasniiNer: "uridchilsanZakhialga",
    href: "/khyanalt/uridchilsanZakhialga",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    ),
  },
  {
    ner: "Оношилгоо",
    khuudasniiNer: "onoshilgoo",
    href: "/khyanalt/onoshilgoo",
    icon: (
      <svg
        fill="currentColor"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5,22H19a3,3,0,0,0,3-3V5a3,3,0,0,0-3-3H5A3,3,0,0,0,2,5V19A3,3,0,0,0,5,22Zm14-2H5a1,1,0,0,1-1-1V13H8a1,1,0,0,0,.928-.628L10,9.692l3.071,7.68a1,1,0,0,0,1.858,0L16.677,13H20v6A1,1,0,0,1,19,20ZM5,4H19a1,1,0,0,1,1,1v6H16a1,1,0,0,0-.929.629L14,14.307,10.929,6.628a1,1,0,0,0-1.857,0L7.323,11H4V5A1,1,0,0,1,5,4Z" />
      </svg>
    ),
  },
  {
    ner: "Ажилтан",
    khuudasniiNer: "ajiltanKhyanalt",
    href: "/khyanalt/ajiltanKhyanalt/ajiltanBurtgel",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },
  {
    ner: "Үйлчилгээ",
    khuudasniiNer: "uilchilgeeBurtgel",
    href: "/khyanalt/buteegdekhuuniiKhyanalt/uilchilgeeBurtgel",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    ),
  },
  {
    ner: "Агуулах",
    khuudasniiNer: "aguulakhiinKhyanalt",
    href: "/khyanalt/aguulakhiinKhyanalt",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
    ),
  },
  {
    ner: "Салбар",
    khuudasniiNer: "lavlakhKhyanalt",
    href: "/khyanalt/lavlakhKhyanalt",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    ner: "Миний захиалгууд",
    khuudasniiNer: "ajiltaniiZakhialguud",
    nuuya: true,
    href: "/khyanalt/ajiltanKhyanalt/ajiltaniiZakhialguud",
  },
  {
    ner: "Харилцагч",
    khuudasniiNer: "khariltsagchiinBulan",
    href: "/khyanalt/khariltsagchiinBulan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    ner: "ХАБЭА ажилтан",
    khuudasniiNer: "khabeaBuglukh",
    href: "/khyanalt/ajiltanKhyanalt/khabeaBuglukh",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
  },
  // {
  //   ner: "ХАБЭА асуумж",
  //   khuudasniiNer: "khabea",
  //   href: "/khyanalt/khabea",
  //   icon: (
  //     <svg
  //       xmlns='http://www.w3.org/2000/svg'
  //       width='24'
  //       height='24'
  //       viewBox='0 0 24 24'
  //       fill='none'
  //       stroke='currentColor'
  //       strokeWidth='1.5'
  //       strokeLinecap='round'
  //       strokeLinejoin='round'>
  //       <circle cx='12' cy='12' r='3'></circle>
  //       <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'></path>
  //     </svg>
  //   ),
  // },
  {
    ner: "Төлбөр тооцоо",
    khuudasniiNer: "tulbur",
    href: "/khyanalt/tulbur",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
  {
    ner: "Дансны хуулга",
    khuudasniiNer: "khuulga",
    href: "/khyanalt/tulbur/dans",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        icon-name="clipboard"
        data-lucide="clipboard"
        class="lucide lucide-clipboard block mx-auto"
      >
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      </svg>
    ),
  },
  {
    ner: "И-Баримт",
    khuudasniiNer: "eBarimt",
    href: "/khyanalt/eBarimt",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    ner: "Даалгавар",
    khuudasniiNer: "daalgavar",
    href: "/khyanalt/daalgavar",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        icon-name="plus-square"
        data-lucide="plus-square"
        className="lucide lucide-plus-square mx-auto block"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    ),
  },
  {
    ner: "Устгасан түүх",
    khuudasniiNer: "ustsanTuukh",
    href: "/khyanalt/ustsanTuukh",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19 19H5V5h6V3H5a2.006 2.006 0 0 0-2 2v14a2.006 2.006 0 0 0 2 2h14a2.006 2.006 0 0 0 2-2v-4h-2Z"
        />
        <path
          fill="currentColor"
          d="M15 5h6v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5Zm7-2h-2l-.571-1h-2.858L16 3h-2v1h8V3z"
        />
      </svg>
    ),
  },
  {
    ner: "ХАБЭА",
    khuudasniiNer: "khabea",
    href: "/khyanalt/khabea",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
    sub: [
      {
        ner: "Бүртгэл",
        khuudasniiNer: "khabea/burtgel",
        href: "/khyanalt/khabea/burtgel",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            icon-name="file-plus"
            data-lucide="file-plus"
            class="lucide lucide-file-plus block mx-auto"
          >
            <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        ),
      },
      {
        ner: "Түүх",
        khuudasniiNer: "khabea/tuuh",
        href: "/khyanalt/khabea/tuuh",
        icon: <FileDoneOutlined style={{ fontSize: "23px" }} />,
      },
    ],
  },
  {
    ner: "Ирц",
    khuudasniiNer: "ajiltaniiIrts",
    href: "/khyanalt/ajiltaniiIrts",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        icon-name="clock"
        data-lucide="clock"
        class="lucide lucide-clock block mx-auto"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    sub: [
      {
        ner: "Жагсаалт",
        khuudasniiNer: "ajiltaniiIrts/khyanalt",
        href: "/khyanalt/ajiltaniiIrts/khyanalt",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            icon-name="layers"
            data-lucide="layers"
            class="lucide lucide-layers block mx-auto"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        ),
      },
      {
        ner: "Хяналт",
        khuudasniiNer: "ajiltaniiIrts/jagsaalt",
        href: "/khyanalt/ajiltaniiIrts/jagsaalt",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            icon-name="calendar"
            data-lucide="calendar"
            class="lucide lucide-calendar block mx-auto"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        ),
      },
    ],
  },
  {
    ner: "Тайлан",
    khuudasniiNer: "tailan",
    href: "/khyanalt/tailan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </svg>
    ),
    sub: [
      {
        ner: "Борлуулалт",
        khuudasniiNer: "tailan/borluulaltiinTailanAvya",
        href: "/khyanalt/tailan/borluulaltiinTailanAvya",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        ),
      },
      {
        ner: "Ажилтан",
        khuudasniiNer: "tailan/ajiltnaarTailanAvya",
        href: "/khyanalt/tailan/ajiltnaarTailanAvya",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        ),
      },
      {
        ner: "Хөнгөлөлт",
        khuudasniiNer: "tailan/khungulultiinTailanAvya",
        href: "/khyanalt/tailan/khungulultiinTailanAvya",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            icon-name="percent"
            data-lucide="percent"
            class="lucide lucide-percent block mx-auto"
          >
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
          </svg>
        ),
      },
      {
        ner: "График",
        khuudasniiNer: "tailan/graphicTailan",
        href: "/khyanalt/tailan/graphicTailan",
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <line x1="4" y1="19" x2="20" y2="19" />{" "}
            <polyline points="4 15 8 9 12 11 16 6 20 10" />
          </svg>
        ),
      },
      // {
      //   ner: "Аналитик",
      //   khuudasniiNer: "analytictailan",
      //   href: "/khyanalt/tailan/analytic",
      //   icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="sliders" data-lucide="sliders" class="lucide lucide-sliders block mx-auto"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>),
      // },
      {
        ner: "Хүснэгт",
        khuudasniiNer: "tailan/khusnegt",
        href: "/khyanalt/tailan/khusnegtTailan",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            icon-name="layout"
            data-lucide="layout"
            class="lucide lucide-layout block mx-auto"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        ),
      },
      {
        ner: "Худалдагч",
        khuudasniiNer: "tailan/hudaldagchiinTailan",
        href: "/khyanalt/tailan/hudaldagchiinTailan",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            icon-name="user"
            data-lucide="user"
            class="lucide lucide-user block mx-auto"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        ),
      },
      {
        ner: "Агуулахын түүх",
        khuudasniiNer: "tailan/aguulgiinTuukh",
        href: "/khyanalt/tailan/aguulgiinTuukh",
        icon: (
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            class="text-2xl"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M208.242 24.629l-52.058 95.205 95.207 52.059 17.271-31.586-42.424-23.198A143.26 143.26 0 0 1 256 114c78.638 0 142 63.362 142 142s-63.362 142-142 142-142-63.362-142-142c0-16.46 2.785-32.247 7.896-46.928l-32.32-16.16C82.106 212.535 78 233.798 78 256c0 98.093 79.907 178 178 178s178-79.907 178-178S354.093 78 256 78c-13.103 0-25.875 1.44-38.18 4.148l22.008-40.25-31.586-17.27zm104.27 130.379L247 253.275V368h18V258.725l62.488-93.733-14.976-9.984z"></path>
          </svg>
        ),
      },
    ],
  },
];

function useErkh(ajiltan) {
  const router = useRouter();
  if (!ajiltan) return [];
  var tsonkhErkh = [];
  var tsonkhniiErkh = JSON.parse(localStorage.getItem("tsonkhniiErkh")) || [];
  const erkh =
    ajiltan.erkh === "Admin"
      ? khereglegchiinErkh.find((x) => x.erkh === "Admin").tsonkhnuud
      : ajiltan.erkh === "Zasvarchin"
      ? khereglegchiinErkh.find((x) => x.erkh === "Zasvarchin").tsonkhnuud
      : ajiltan.erkh === "Injener"
      ? khereglegchiinErkh.find((x) => x.erkh === "Injener").tsonkhnuud
      : ajiltan.tsonkhniiErkhuud;
  tsonkhErkh = _.cloneDeep(
    khuudasnuud
      .filter(
        (x) =>
          !!erkh.find(
            (y) =>
              x.href.includes(y) || (x?.sub && x.sub?.find((c) => c.href === y))
          )
      )
      .filter((a) => {
        return tsonkhniiErkh?.find(
          (b) =>
            b.zam === a.href || (a.sub && a.sub?.find((c) => c.href === b.zam))
        );
      })
  );
  if (ajiltan?.erkh === "Admin") {
    if (!!tsonkhErkh.find((x) => x.khuudasniiNer === "daalgavar")) {
      tsonkhErkh.find((x) => x.khuudasniiNer === "daalgavar").href =
        "/khyanalt/daalgavar/admin";
    }
  } else if (!!tsonkhErkh.find((x) => x.khuudasniiNer === "daalgavar")) {
    tsonkhErkh.find((x) => x.khuudasniiNer === "daalgavar").href =
      "/khyanalt/daalgavar";
    tsonkhErkh.forEach((a) => {
      if (a.sub && a.sub.length > 0) {
        a.sub = a.sub.filter((d) => erkh.find((e) => e === d.href));
      }
    });
  }
  if (
    !router.pathname.includes("khyanalt/tokhirgoo") &&
    !router.pathname.includes(
      "/khyanalt/ajiltanKhyanalt/ajiltaniiZakhialguud/"
    ) &&
    !router.pathname.includes("[tailangiinNer]") &&
    (!erkh || !erkh.find((x) => !!router.pathname.includes(x)))
  ) {
    if (erkh.length > 0) {
      router.replace(tsonkhErkh[0].href);
    } else if (ajiltan.erkh !== "Zasvarchin" && ajiltan.erkh !== "Injener") {
      router.replace("/404");
    }
    return [];
  }

  return tsonkhErkh;
}

export default useErkh;
