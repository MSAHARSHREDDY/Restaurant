import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    {
      duration: "30s",
      target: 50,
    },

    {
      duration: "1m",
      target: 100,
    },

    {
      duration: "30s",
      target: 0,
    },
  ],

  thresholds: {
    http_req_failed: ["rate<0.05"],

    http_req_duration: [
      "p(95)<500",
    ],
  },
};

export default function () {

  // HOME PAGE
  const home = http.get(
    "https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/"
  );

  console.log(
    `HOME STATUS: ${home.status}`
  );

  check(home, {
    "Home returned 200":
      (r) => r.status === 200,
  });



  // MENU PAGE
  const menu = http.get(
    "https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/menu"
  );

  console.log(
    `MENU STATUS: ${menu.status}`
  );

  check(menu, {
    "Menu returned 200":
      (r) => r.status === 200,
  });



  // ABOUT PAGE
  const about = http.get(
    "https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/about"
  );

  console.log(
    `ABOUT STATUS: ${about.status}`
  );

  check(about, {
    "About returned 200":
      (r) => r.status === 200,
  });



  // GALLERY PAGE
  const gallery = http.get(
    "https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/gallery"
  );

  console.log(
    `GALLERY STATUS: ${gallery.status}`
  );

  check(gallery, {
    "Gallery returned 200":
      (r) => r.status === 200,
  });



  sleep(1);

}