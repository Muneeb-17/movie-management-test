const Express = require("express");
const {
  createMovie,
  getAllMovies,
  editMovies,
  deleteMovie,
} = require("../controller/movies");
const router = Express.Router();
const authenticateToken = require('../middleware/authentication');
const multerConfig = require('../middleware/multerConfig');


router.post("/", authenticateToken, multerConfig.single("poster"), createMovie);
router.get("/", authenticateToken, getAllMovies);
router.put("/:id", authenticateToken, multerConfig.single("poster"), editMovies);
router.delete("/:id", authenticateToken, deleteMovie);

module.exports = router;
