import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 5,
    duration: '30s',

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
    },
};

const BASE_URL = 'http://localhost:3001';

export default function () {

    //Obtener todas las pizzas
    let res = http.get(`${BASE_URL}/api/v1/pizzas`);

    check(res, {
        'GET todas las pizzas - status 200': (r) => r.status === 200,
    });

    sleep(1);

    //Para crear una pizza y obtener su ID

    const pizza = JSON.stringify({
        nombre: 'Pizza k6',
        descripcion: 'Pizza creada para prueba de rendimiento'
    });

    res = http.post(
        `${BASE_URL}/api/v1/pizzas`,
        pizza,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    check(res, {
        'POST pizza - status 201': (r) => r.status === 201,
    });

    // Obtener el ID creado por el POST
    let id;

    if (res.status === 201) {
        const body = res.json();
        id = body.id;
    }

    check(res, {
        'POST devuelve un ID': () => id !== undefined,
    });

    sleep(1);

    //Para obtener pizza por ID

    if (id !== undefined) {

        res = http.get(`${BASE_URL}/api/v1/pizzas/${id}`);

        check(res, {
            'GET pizza por ID - status 200': (r) => r.status === 200,
        });

    }

    sleep(1);

    //Para actualizar pizza

    if (id !== undefined) {

        const pizzaActualizada = JSON.stringify({
            nombre: 'Pizza k6 actualizada',
            descripcion: 'Pizza modificada durante la prueba'
        });

        res = http.put(
            `${BASE_URL}/api/v1/pizzas/${id}`,
            pizzaActualizada,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        check(res, {
            'PUT pizza - status 200': (r) => r.status === 200,
        });

    }

    sleep(1);


    //Para eliminar pizza

    if (id !== undefined) {

        res = http.del(
            `${BASE_URL}/api/v1/pizzas/${id}`
        );

        check(res, {
            'DELETE pizza - status 202': (r) => r.status === 202,
        });

    }

    sleep(1);
}