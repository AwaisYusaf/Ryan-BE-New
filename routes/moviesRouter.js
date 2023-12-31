"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require("express");
const {
  GetMovies,
  AddMovie,
  EditMovie,
  DeleteMovie,
  PrepareCSV,
  PrepareTXT,
  GetMovieByID,
} = require("../controllers/moviesControllers");
const moviesRouter = Router();
moviesRouter.route("/").get(GetMovies).post(AddMovie).put(EditMovie);
moviesRouter.route("/:id").get(GetMovieByID).delete(DeleteMovie);
moviesRouter.route("/download-csv").get(PrepareCSV);
moviesRouter.route("/download-txt").get(PrepareTXT);

module.exports = moviesRouter;
