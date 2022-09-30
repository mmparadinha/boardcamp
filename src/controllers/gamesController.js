import connection from '../database/database.js';

export async function listGames(req, res) {
    const gameName = req.query.name;

    try {
        let games = [];

        if (!gameName) {
            games = await connection.query(`
                SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id
            `);
        } else {
            games = await connection.query(`
                SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id WHERE LOWER(games.name) LIKE LOWER($1)
            `, [gameName + '%']);
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
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    if (!name) { return res.sendStatus(400) };
    if (stockTotal <= 0 || pricePerDay <= 0) { return res.sendStatus(400) };

    try {
        const categoryExists = await connection.query(`
            SELECT * FROM categories WHERE id=$1
        `, [categoryId]);
        if (!categoryExists.rows[0]) { return res.sendStatus(400) };

        const gameExists = await connection.query(`
            SELECT * FROM games WHERE name=$1
        `, [name]);
        if (gameExists.rows[0]) { return res.sendStatus(409) };

        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)
        `, [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}