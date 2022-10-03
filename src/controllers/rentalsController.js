import connection from '../database/database.js';
import dayjs from 'dayjs';

export async function listAllRentals(req, res) {
    const { customerId, gameId, order, desc } = req.query;

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
                    ) as game
                FROM rentals
                    JOIN customers ON rentals."customerId"=customers.id
                    JOIN games ON rentals."gameId"=games.id
                ${order ? `ORDER BY ${order}` : ''}
                ${desc ? `DESC` : ''};
            `);
        } else if (customerId && gameId) {
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
                    ) as game
                    FROM rentals
                        JOIN customers ON rentals."customerId"=customers.id
                        JOIN games ON rentals."gameId"=games.id
                WHERE rentals."customerId"=$1 AND rentals."gameId"=$2
                ${order ? `ORDER BY ${order}` : ''}
                ${desc ? `DESC` : ''};
            `, [customerId, gameId]);
        } else {
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
                    ) as game
                    FROM rentals
                        JOIN customers ON rentals."customerId"=customers.id
                        JOIN games ON rentals."gameId"=games.id
                WHERE rentals."customerId"=$1 OR rentals."gameId"=$2
                ${order ? `ORDER BY ${order}` : ''}
                ${desc ? `DESC` : ''};
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

export async function returnRental(req, res) {
    const { id } = req.params;
    const UTCday = 1440 * 60 * 1000;

    try {
        const rentalExists = await connection.query(`
            SELECT * FROM rentals WHERE id=$1;
        `, [id]);
        if (!rentalExists.rows[0]) { return res.sendStatus(404) };
        if (rentalExists.rows[0].returnDate) { return res.sendStatus(400) };

        const dataRented = Date.parse(rentalExists.rows[0].rentDate.toISOString().substring(0,10));
        const limitDate = dataRented + rentalExists.rows[0].daysRented*UTCday

        const daysDelayed = Math.ceil((limitDate - Date.now())/UTCday);

        if (daysDelayed < 0) {
            await connection.query(`
                UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;
            `, [dayjs().format('YYYY-MM-DD'), rentalExists.rows[0].originalPrice*Math.abs(daysDelayed), id]);
        } else {
            await connection.query(`
                UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;
            `, [dayjs().format('YYYY-MM-DD'), 0, id]);
        }
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        const rentalExists = await connection.query(`
            SELECT * FROM rentals WHERE id=$1;
        `, [id]);
        if (!rentalExists.rows[0]) { return res.sendStatus(404) };
        if (!rentalExists.rows[0].returnDate) { return res.sendStatus(400) };

        await connection.query(`
            DELETE FROM rentals WHERE id=$1;
        `, [id]);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}