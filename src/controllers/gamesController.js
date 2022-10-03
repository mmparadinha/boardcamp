import connection from '../database/database.js';
import { stripHtml } from 'string-strip-html';

export async function listGames(req, res) {
    const { name, order, desc, limit, offset } = req.query;

    try {
        let games = [];

        if (!name) {
            games = await connection.query(`
                SELECT
                    games.*,
                    categories.name AS "categoryName",
                    COUNT("gameId") AS "rentalsCount"
                FROM games
                    JOIN categories ON games."categoryId"=categories.id
                    JOIN rentals ON games.id=rentals."gameId"
                GROUP BY games.id, categories.name
                    ${order ? `ORDER BY ${order}` : ''}
                    ${desc ? `DESC` : ''}
                    ${limit ? `LIMIT ${limit}` : ''}
                    ${offset ? `OFFSET ${offset}` : ''};
            `);
        } else {
            games = await connection.query(`
            SELECT
                games.*,
                categories.name AS "categoryName",
                COUNT("gameId") AS "rentalsCount"
            FROM games
                JOIN categories ON games."categoryId"=categories.id
                JOIN rentals ON games.id=rentals."gameId"
            WHERE games.name ILIKE $1
            GROUP BY games.id, categories.name
                ${order ? `ORDER BY ${order}` : ''}
                ${desc ? `DESC` : ''}
                ${limit ? `LIMIT ${limit}` : ''}
                ${offset ? `OFFSET ${offset}` : ''};
            `, [name + '%']);
        }

        if (!games.rows[0]) {
            return res.sendStatus(404);
        }

        res.send(games.rows);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function createGame(req, res) {
    const { stockTotal, categoryId, pricePerDay } = req.body;
    const gameName = stripHtml(req.body.name).result;
    const gameImage = stripHtml(req.body.image).result;


    if (!gameName) { return res.sendStatus(400) };
    if (stockTotal <= 0 || pricePerDay <= 0) { return res.sendStatus(400) };

    try {
        const categoryExists = await connection.query(`
            SELECT * FROM categories WHERE id=$1;
        `, [categoryId]);
        if (!categoryExists.rows[0]) { return res.sendStatus(400) };

        const gameExists = await connection.query(`
            SELECT * FROM games WHERE name=$1;
        `, [gameName]);
        if (gameExists.rows[0]) { return res.sendStatus(409) };

        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);
        `, [gameName, gameImage, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}