const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    return await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
  } catch (error) {
    console.error("getclassifications error " + error)
    return { rows: [] };
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorybyclassificationid error " + error)
    return []
  }
}

/* ***************************
 *  Get inventory item by inventory_id
 * ************************** */
async function getInventoryByInvId(inventory_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [inventory_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getinventorybyinvid error " + error);
    return null;
  }
}

/* ***************************
 *  Get a classification by id
 * ************************** */
async function getClassificationById(classification_id) {
  try {
    const result = await pool.query("SELECT * FROM classification WHERE classification_id = $1", [classification_id])
    return result.rows[0]
  } catch (error) {
    console.error("getclassificationbyid error " + error)
    return null
  }
}
/* ***************************
 *  Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    console.error("checkexistingclassification error: " + error)
    return null
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("addclassification error: " + error)
    return null
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    console.error("addinventory error: " + error)
    return null
  }
}

/* ***************************
 *  Delete classification by name
 * ************************** */
async function deleteClassificationByName(classification_name){
  try {
    const sql = "DELETE FROM classification WHERE classification_name = $1"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("deleteemptyclassifications error: " + error)
    return null
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInvId, getClassificationById, checkExistingClassification, addClassification, addInventory, deleteClassificationByName};
