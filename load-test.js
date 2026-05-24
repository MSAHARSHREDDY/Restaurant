import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {

http.get(
'https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/'
);

http.get(
'https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/menu'
);

http.get(
'https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/about'
);

http.get(
'https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/specials'
);

http.get(
'https://restaurant-git-main-malladi-saharsh-reddys-projects.vercel.app/gallery'
);

sleep(1);

}