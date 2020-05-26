//Requeridos
const express = require('express');
const router = express.Router();

//Modelos
const Usuario = require('../models/models').usuario;
const Log = require('../models/models').logaceso;

//Rutas
//GET - Todos
router.get('/usuario', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json({ status: 'OK', message: 'Obtenidos', data: usuarios });
    } catch(err) {
        res.json({ message: err });
    }
});

//GET - por id
router.get('/usuario/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        res.json({ status: 'OK', message: 'Obtenido', data: usuario });
    } catch(err) {
        res.json({ message: err });
    }
});

//POST - {json}
router.post('/usuario', async (req, res) => {
    const { nombre, contraseña, rol, email } = req.body;
    const usuario = new Usuario({ nombre, contraseña, rol, email });

    try {
        await Usuario.findOne({ nombre: nombre })
            .then(doc => {
                if (doc === null) {
                    const saved = usuario.save();
                    res.json({ status: 'OK', message: 'Insertado correctamente...', data: saved });
                }else{
                    res.json({ status: 'FAILED', message: 'Usuario ya existente...', data: doc });
                }
            }).catch(err => {
                res.json({ status: 'FAILED', message: err });
            });
    } catch(err) {
        res.json({ message: err });
    };
    
});

//POST - {json}
router.post('/usuario/autenticar', async (req, res) => {
    try {
        var autenticado = false;

        await Usuario.findOne({ nombre: req.body.nombre, contraseña: req.body.contraseña})
            .then(doc => {
                if (doc === null) res.json({ status: 'FAILED', message: '', data: doc });
                else {
                    //salvando el log cada vez que me autentico
                    const log = new Log({fecha: Date.now(), usuario: doc._id });
                    log.save();

                    res.json({ status: 'OK', message: 'Autenticado', data: doc });
                }
            })
            .catch(err => {
                res.json({ status: 'FAILED', message: err });
            });
    } catch(err) {
        res.json({ status: 'FAILED', message: err });
    };
});

//DELETE - Un usuario por id /usuario/id
router.delete('/usuario/:id', async (req, res) => {
    try {
        const removed = await Usuario.findByIdAndRemove(req.params.id);

        res.json({ status: 'OK', message: 'Eliminado correctamente...', data: removed });
    } catch(err) {
        res.json({ message: err });
    }
});

//PATCH - Un usuario por id /usuario/id - {json}
router.patch('/usuario/:id', async (req, res) => {
    try {
        const { email, rol } = req.body;
        const data = { email, rol };
        await Usuario.findByIdAndUpdate(req.params.id, data);
        res.json({ status: 'OK', message: 'Modificado correctamente...', data: data });
    } catch(err) {
        res.json({ message: err });
    }
});

//PATCH - Cambiar clave /usuario/id - {json}
router.patch('/usuario/password/:id', async (req, res) => {
    try {
        const { contraseña } = req.body;
        const data = { contraseña };
        await Usuario.findByIdAndUpdate(req.params.id, data);
        res.json({ status: 'OK', message: 'Contraseña cambiada correctamente...', data: data });
    } catch(err) {
        res.json({ message: err });
    }
});

module.exports = router;