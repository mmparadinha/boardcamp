import connection from '../database/database.js';
import dayjs from 'dayjs';

export async function listAllRentals(req, res) {
    const { customerId, gameId } = req.query;

    try {
        let rentals = [];
        if (!customerId && !gameId) {
            rentals = await connection.query(`
                SELECT 
                    rentals.*,
                    json_build_object(
                        'id', customers.id,
                        'name', customers.name
                    ) as customer,
                    json_build_object(
                        'id', games.id,
                        'name', games.name,
                        'categoryId', games."categoryId",
                        'categoryName', (SELECT categories.name FROM categories WHERE games."categoryId"=categories.id)
                    ) as game FROM rentals
                        JOIN customers ON rentals."customerId"=customers.id
                        JOIN games ON rentals."gameId"=games.id;
            `);
        } else {
            rentals = await connection.query(`
                SELECT * FROM rentals WHERE rentals."customerId"=$1 OR rentals."gameId"=$2;
            `, [customerId, gameId]);
        }

        if (!rentals.rows[0]) {
            return res.sendStatus(404);
        }

        res.send(rentals.rows);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    if (daysRented <= 0) { return res.sendStatus(400) };

    try {
        const customerExists = await connection.query(`
            SELECT * FROM customers WHERE id=$1;
        `, [customerId]);
        if (!customerExists.rows[0]) { return res.sendStatus(400) };

        const gameExists = await connection.query(`
            SELECT * FROM games WHERE id=$1;
        `, [gameId]);
        if (!gameExists.rows[0]) { return res.sendStatus(400) };

        const isRented = await connection.query(`
            SELECT * FROM rentals WHERE rentals."gameId"=$1 AND rentals."returnDate" IS NULL;
        `, [gameId]);

        const isAvailable = gameExists.rows[0].stockTotal - isRented.rows.length;
        if (isAvailable <= 0) { return res.sendStatus(400) };

        await connection.query(`
            INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, daysRented, dayjs().format('YYYY-MM-DD'), daysRented*gameExists.rows[0].pricePerDay, null, null]);
        res.sendStatus(201);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}