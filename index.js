'use strict';
const Joi = require('@hapi/joi');
const Hapi = require('@hapi/hapi');
const server = new Hapi.Server({
    host: 'localhost',
    port: 3101,
});

server.route([
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'I am Root Route';
        },
    },
    {
        method: 'GET',
        path: '/hello',
        handler: (request, h) => {
            return { msg: 'Hello, I am Baymax' };
        },
    },
    {
        method: 'POST',
        path: '/register',
        handler: (request, h) => {
            return { msg: 'i am register using post' };
        },
    },
    {
        method: 'POST',
        path: '/persegi',
        config: {
            validate: {
                payload: {
                    panjang: Joi.number().min(1).required(),
                    lebar: Joi.number().min(1).required()
                }
            }
        },
        handler: (request, h) => {
            console.log(request.payload);
            let panjangRequest = request.payload.panjang; //konversi string ke number
            let lebarRequest = request.payload.lebar;
            let hasil = parseInt(panjangRequest) * parseInt(lebarRequest)//bikin variabel penampung nilai luas
            let statusCode = 200
            const contentData = {
                data: "Hitung Luas Segitiga",
                panjang: panjangRequest,
                lebar: lebarRequest,
                hasilPerhitungan: hasil,
            }
            const data = {
                statusCode: "200",
                error: "",
                message: 'Hitung Luas Persegi',
                content: {
                    contentData
                }
            }
            return h.response(data).code(200)
        },
    },
    {
        method: 'POST',
        path: '/ganjilgenap',
        config: {
            validate: {
                payload: {
                    angka: Joi.number().min(1).required()
                }
            }
        },
        handler: (request, h) => {
            console.log(request.payload);
            let angkaRequest = request.payload.angka;
            let hasil;
            if (parseInt(angkaRequest) % 2 == 1) {
                hasil = 'Ganjil';
            }
            else {
                hasil = 'Genap';
            }
            const data = { data: 'Angka :', ...request.payload, Bilangan: hasil }
            return h.response(data).code(200)
        },
    }
])

const main = async () => {
    await server.register(require('./src/routes/users'));
    await server.start()
    return server
};

main().then(server => {
    console.log('Server running at :',
        server.info.uri)
}).catch(err => {
    console.log(err)
    process.exit(1)
})

// http://localhost:3101/api/v1/users
// http://localhost:3101/api/v1/users/1