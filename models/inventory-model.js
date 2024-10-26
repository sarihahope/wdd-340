const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


async function getClassificationById(inv_id) {
  try {
    const data = await pool.query(
      'SELECT * FROM public.inventory ORDER BY inv_id ASC',
  )
    return data.rows[inv_id-1]
  
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// Add a new classification to the database
async function addClassificationModel(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

// Add invenotry to the database

async function addInventoryModel(
  inv_make, 
  inv_model, 
  inv_description, 
  inv_image, 
  inv_thumbnail, 
  inv_price, 
  inv_year,
  inv_miles, 
  inv_color,
  classification_id) {
    try {
      const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
      return await pool.query(sql, [
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year,
        inv_miles, 
        inv_color,
      classification_id])
    } catch (error) {
      return error.message
    }
  }

  /* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

// Add Review to the database from the user input form 
async function addReviewModel(review_name, review_content, review_rating, review_date, inv_id) {
  try {
    const sql = "INSERT INTO public.review (review_name, review_content, review_rating, review_date, inv_id) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    return await pool.query(sql, [review_name, review_content, review_rating, review_date, inv_id])
  } catch (error) {
    return error.message
  }
}

// Get all reviews by inv_id
async function getReviewsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r
      JOIN public.inventory AS i
      ON r.inv_id = i.inv_id
      WHERE r.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByInvId error " + error)
  }
}

// Get all reviews by review_id
async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r
      JOIN public.inventory AS i
      ON r.inv_id = i.inv_id
      WHERE r.review_id = $1`,
      [review_id]
    )
    return data.rows[0]
  }
  catch (error) {
    console.error("getReviewById error " + error)
  }
}

// Update Review Data
async function updateReview(review_id, review_name, review_content, review_rating, review_date, inv_id) {
  try {
    const sql = "UPDATE public.review SET review_name = $1, review_content = $2, review_rating = $3, review_date = $4, inv_id = $5 WHERE review_id = $6 RETURNING *"
    const data = await pool.query(sql, [review_name, review_content, review_rating, review_date, inv_id, review_id])
    return data.rows[0]
  } catch (error) {
    console.error("updateReview error " + error)
  }
}

// Delete Review Item
async function deleteReviewItem(review_id) {
  try {
    const sql = 'DELETE FROM review WHERE review_id = $1'
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    new Error("Delete Review Error")
  }
}




module.exports = {getClassifications, getInventoryByClassificationId,  getClassificationById, addClassificationModel, addInventoryModel, updateInventory, deleteInventoryItem, addReviewModel, getReviewsByInvId, getReviewById, updateReview, deleteReviewItem}





