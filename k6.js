import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
};

const baseUrl = 'https://utilidades.vmartinez84.xyz/api/CodigosPostales/';

export default function () {
  const resEstados = http.get(`${baseUrl}estados`);
  check(resEstados, {
    'Estados status code 200': (r) => r.status === 200,
  });

  const resAleatorio = http.get(`${baseUrl}aleatorio`);
  check(resAleatorio, {
    'CP aleatorio status code 200': (r) => r.status === 200,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'reporte_pizzas.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}