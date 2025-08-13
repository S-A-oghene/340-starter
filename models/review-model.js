const pool = require("../database/");

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(review_text, review_rating, inv_id, account_id) {
  try {
    const sql =
      "INSERT INTO review (review_text, review_rating, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [
      review_text,
      review_rating,
      inv_id,
      account_id,
    ]);
  } catch (error) {
    throw new Error("addReview error: " + error);
  }
}

/* ***************************
 *  Get reviews by inventory ID
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_rating, r.review_date, a.account_id, a.account_firstname, a.account_lastname 
       FROM public.review r 
       JOIN public.account a ON r.account_id = a.account_id 
       WHERE r.inv_id = $1 
       ORDER BY r.review_date DESC`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    throw new Error("getReviewsByInventoryId error: " + error);
  }
}

/* ***************************
 *  Get reviews by account ID
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_rating, r.review_date, i.inv_make, i.inv_model 
         FROM public.review r 
         JOIN public.inventory i ON r.inv_id = i.inv_id 
         WHERE r.account_id = $1 
         ORDER BY r.review_date DESC`,
      [account_id]
    );
    return data.rows;
  } catch (error) {
    throw new Error("getReviewsByAccountId error: " + error);
  }
}

/* ***************************
 *  Get a single review by review_id
 * ************************** */
async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, i.inv_make, i.inv_model 
       FROM public.review r 
       JOIN public.inventory i ON r.inv_id = i.inv_id 
       WHERE r.review_id = $1`,
      [review_id]
    );
    return data.rows[0];
  } catch (error) {
    throw new Error("getReviewById error: " + error);
  }
}

/* ***************************
 *  Update an existing review
 * ************************** */
async function updateReview(review_id, review_text, review_rating) {
  try {
    const sql =
      "UPDATE public.review SET review_text = $1, review_rating = $2 WHERE review_id = $3 RETURNING *";
    const data = await pool.query(sql, [review_text, review_rating, review_id]);
    return data.rows[0];
  } catch (error) {
    throw new Error("updateReview error: " + error);
  }
}

/* ***************************
 *  Delete a review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1";
    const data = await pool.query(sql, [review_id]);
    return data;
  } catch (error) {
    throw new Error("deleteReview error: " + error);
  }
}

module.exports = {
  addReview,
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview,
};
