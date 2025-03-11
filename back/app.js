const express = require('express');
const { body, query, validationResult } = require('express-validator');
const app = express();
const cors = require('cors');
const port = 3000;
app.use(cors());
app.use(express.json());

let store = {};

const saveValidation = [
    body('key').exists().withMessage("Required 'key'"),
    body('data').exists().withMessage("Required 'data'")
];

app.post('/save', saveValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    store[req.body.key] = req.body.data;
    res.send("saved!");
});

const getValidation = [
    query('key')
        .exists().withMessage("Required 'key'")
        .custom(value => {
            if (!(value in store)) {
                throw new Error('Key does not exist in store');
            }
            return true;
        })
];

app.get('/get', getValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    let data = store[req.query.key]
    res.send(data);
  })

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})