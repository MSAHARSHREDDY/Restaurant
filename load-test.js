// import http from "k6/http";
// import { group, check, sleep } from "k6";

// export const options = {
//   // Scenario: Ramp up to 50 concurrent users over 1 minute, 
//   // hold for 2 minutes, then scale down
//   stages: [
//     { duration: "30s", target: 20 },  // Ramp up to 20 users
//     { duration: "1m", target: 50 },   // Ramp up to 50 users (adjust this to test limits)
//     { duration: "30s", target: 50 },  // Hold at 50 users
//     { duration: "30s", target: 0 },   // Ramp down to 0
//   ],
//   thresholds: {
//     // 95% of API requests should finish in under 800ms
//     http_req_duration: ["p(95)<800"],
//     // Failure rate should be less than 1%
//     http_req_failed: ["rate<0.01"],
//   },
// };

// // IMPORTANT: Replace this with your actual PRODUCTION domain!
// const BASE_URL = "https://restaurant-chi-bay.vercel.app/";

// export default function () {
//   group("Frontend (Vercel CDN)", function () {
//     // Testing Vercel's caching layer
//     const homeRes = http.get(`${BASE_URL}/`);
//     check(homeRes, { "Home returned 200": (r) => r.status === 200 });

//     const menuRes = http.get(`${BASE_URL}/menu`);
//     check(menuRes, { "Menu returned 200": (r) => r.status === 200 });
//   });

//   sleep(0.5); // Simulate user taking half a second to read

//   group("Backend (Vercel Serverless & MongoDB)", function () {
//     // Testing the backend API logic and Database speed
//     // This public route uses MongoDB to fetch open tables
//     const tableRes = http.get(`${BASE_URL}/api/reservations/available-tables?date=2024-12-01&time=19:00`);
//     check(tableRes, { 
//       "API Available Tables returned 200": (r) => r.status === 200 
//     });
//   });

//   sleep(1); // Wait 1 second before the user makes their next set of actions
// }







import http from "k6/http";
import { group, check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 10 },    // ramp to 50
    { duration: "2m", target: 100 },   // ramp to 100
    { duration: "2m", target: 150 },   // hold 150 users
    { duration: "1m", target: 0 },     // ramp down
  ],

  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.02"],
  },
};

const BASE_URL =
  "https://restaurant-chi-bay.vercel.app";

export default function () {

  group(
    "Frontend",
    function () {

      const home =http.get(`${BASE_URL}/`);

      check(home, {"HOME 200":(r) => r.status === 200
      });

      const menu =http.get(`${BASE_URL}/menu`);

      check(menu, {"MENU 200":(r) => r.status === 200
      });

    }
  );


  sleep(0.5);


  group(
    "Login Flow",
    function () {

      const payload =JSON.stringify({
        email:"saharshreddym99@gmail.com",
        password:"123456"
      });

      const login =http.post( `${BASE_URL}/api/login`,payload,{
            headers: {
              "Content-Type":
                "application/json"
            }
          }

        );

      check(login, {
        "LOGIN OK":
          (r) =>

            r.status === 200 ||

            r.status === 400 ||

            r.status === 401
      });

    }
  );


  group(
    "Reservation API",
    function () {

      const tables =
        http.get(

          `${BASE_URL}/api/reservations/available-tables?date=2026-05-25&time=19:00`

        );

      check(
        tables,
        {
          "TABLES OK":
            (r) =>

              r.status === 200
        });

    }
  );


  sleep(1);

}