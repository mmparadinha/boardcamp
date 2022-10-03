import connection from '../database/database.js';
import { stripHtml } from 'string-strip-html';

export async function listCategories (req, res) {
    try {
        const categories = await connection.query(`
            SELECT * FROM categories;
        `);

        if (!categories.rows[0]) {
            return res.sendStatus(404);
        }

        res.send(categories.rows);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function createCategory (req, res) {
    const categoryName = stripHtml(req.body.name.trim()).result;

    if (!categoryName) {return res.sendStatus(400)};

    try {
        const isUsedCategory = await connection.query(`
            SELECT name FROM categories WHERE name=$1;
        `, [categoryName]);

        if (isUsedCategory.rows[0]) {return res.sendStatus(409)};

        await connection.query(`
            INSERT INTO categories (name) VALUES ($1);
        `, [categoryName]);
        res.sendStatus(201);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}