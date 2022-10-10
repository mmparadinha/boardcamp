import { stripHtml } from 'string-strip-html';
import connection from '../database/database.js';

export async function listAllCustomers(req, res) {
    const { cpf, order, desc, limit, offset } = req.query;

    try {
        let customers = [];

        if (!cpf) {
            customers = await connection.query(`
                SELECT
                    customers.*,
                    COUNT("customerId") AS "rentalsCount"
                FROM rentals RIGHT JOIN customers ON customers.id=rentals."customerId"
                GROUP BY customers.id
                    ${order ? `ORDER BY ${order}` : ''}
                    ${desc ? `DESC` : ''}
                    ${limit ? `LIMIT ${limit}` : ''}
                    ${offset ? `OFFSET ${offset}` : ''};
            `);
        } else {
            customers = await connection.query(`
                SELECT
                    customers.*,
                    COUNT("customerId") AS "rentalsCount"
                FROM rentals RIGHT JOIN customers ON customers.id=rentals."customerId"
                WHERE customers.cpf LIKE $1
                GROUP BY customers.id
                    ${order ? `ORDER BY ${order}` : ''}
                    ${desc ? `DESC` : ''}
                    ${limit ? `LIMIT ${limit}` : ''}
                    ${offset ? `OFFSET ${offset}` : ''};
            `, [cpf + '%']);
        }

        res.send(customers.rows);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function listSingleCustomer(req, res) {
    const { id } = req.params;

    try {
        const customer = await connection.query(`
            SELECT
                customers.*,
                COUNT("customerId") AS "rentalsCount"
            FROM rentals JOIN customers ON customers.id=rentals."customerId"
            WHERE customers.id=$1
            GROUP BY customers.id;
        `, [id]);

        if (!customer.rows[0]) {
            return res.sendStatus(404);
        }

        res.send(customer.rows[0]);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function insertCustomer(req, res) {
    const { phone, cpf, birthday } = req.body;
    const customerName = stripHtml(req.body.name.trim()).result;


    try {
        const customerExists = await connection.query(`
            SELECT * FROM customers WHERE cpf=$1;
        `, [cpf]);
        if (customerExists.rows[0]) { return res.sendStatus(409) };

        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);
        `, [customerName, phone, cpf, birthday]);
        res.sendStatus(201);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function updateCustomer(req, res) {
    const { id } = req.params;
    const { phone, cpf, birthday } = req.body;
    const customerName = stripHtml(req.body.name.trim()).result;

    try {
        const customerExists = await connection.query(`
            SELECT * FROM customers WHERE cpf=$1 AND NOT id=$2;
        `, [cpf, id]);
        if (customerExists.rows[0]) { return res.sendStatus(409) };

        await connection.query(`
            UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;
        `, [customerName, phone, cpf, birthday, id]);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}