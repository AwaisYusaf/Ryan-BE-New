"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { DataTypes } = require("sequelize");
//@ts-ignore
const { sequelize } = require("../database/getConn");
const { Op } = require("sequelize");
const fs = require("fs");
const Movie = sequelize.define('Movie', {
    name: DataTypes.STRING,
    duration: DataTypes.STRING,
    rating: DataTypes.STRING,
});
sequelize.sync();
function GetMovieByID(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const movie = yield Movie.findOne({ where: { id } });
            return res.json({ status: "success", message: 'Movie retrieved successfully', movie });
        }
        catch (e) {
            return res.status(500).json({ error: 'An error occurred while retrieving movie' });
        }
    });
}
function sortByNameAscending(arr) {
    arr.sort((a, b) => {
        if (a.name.toLowerCase()[0] > b.name.toLowerCase()[0]) {
            return -1;
        }
        return 1;
    });
}
function sortByNameDescending(arr) {
    arr.sort((a, b) => {
        if (a.name.toLowerCase()[0] < b.name.toLowerCase()[0]) {
            return -1;
        }
        return 1;
    });
}
function sortByRatingAscending(arr) {
    arr.sort((a, b) => {
        if (a.rating < b.rating) {
            return -1;
        }
        return 1;
    });
}
function sortByRatingDescending(arr) {
    arr.sort((a, b) => {
        if (a.rating > b.rating) {
            return -1;
        }
        return 1;
    });
}
function sortMovies(arr, sort) {
    if (!sort) {
        return;
    }
    if (sort === 'name_asc') {
        sortByNameAscending(arr);
    }
    else if (sort === 'name_desc') {
        sortByNameDescending(arr);
    }
    else if (sort === 'rating_asc') {
        sortByRatingAscending(arr);
    }
    else if (sort === 'rating_desc') {
        sortByRatingDescending(arr);
    }
}
function GetMovies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { q, page, sort } = req.query;
        console.log("SORT=", sort);
        if (q) {
            try {
                const movies = yield Movie.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${q}%`
                        }
                    }
                });
                //Update Movie to Get the Latest Movie First
                movies.reverse();
                const currentPage = page ? parseInt(page) - 1 : 0;
                const perPage = 10;
                if (movies.length < perPage) {
                    sortMovies(movies, sort);
                    res.json({ status: "success", message: 'Movies retrieved successfully', movies });
                }
                const pageItems = movies.slice(currentPage * 10, currentPage * 10 + 10);
                sortMovies(pageItems, sort);
                return res.json({ status: "success", message: 'Movies retrieved successfully', movies: pageItems });
            }
            catch (e) {
                return res.status(500).json({ error: 'An error occurred while retrieving movies', movies: [] });
            }
        }
        try {
            const movies = yield Movie.findAll();
            //Update Movie to Get the Latest Movie First
            movies.reverse();
            const currentPage = page ? parseInt(page) - 1 : 0;
            const perPage = 10;
            if (movies.length < perPage) {
                sortMovies(movies, sort);
                return res.json({ status: "success", message: 'Movies retrieved successfully', movies });
            }
            const pageItems = movies.slice(currentPage * 10, currentPage * 10 + 10);
            sortMovies(pageItems, sort);
            return res.json({ status: "success", message: 'Movies retrieved successfully', movies: pageItems });
        }
        catch (e) {
            return res.status(500).json({ error: 'An error occurred while retrieving movies', movies: [] });
        }
    });
}
function AddMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, duration, rating } = req.body;
        try {
            const movie = yield Movie.create({ name, duration, rating });
            return res.json({ status: "success", message: 'Movie added successfully', movie });
        }
        catch (e) {
            return res.status(500).json({ error: 'An error occurred while adding the movie' });
        }
    });
}
function PrepareCSV(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = yield Movie.findAll();
        //Update Movie to Get the Latest Movie First
        movies.reverse();
        // Convert data to CSV format
        let csvContent = 'ID, Name, Duration, Rating\n';
        movies.forEach((row) => {
            csvContent += `${row.id}, ${row.name}, ${row.duration}, ${row.rating}\n`;
        });
        // Create a CSV file
        fs.writeFileSync('data.csv', csvContent);
        // Serve the file for download
        return res.download('data.csv', 'data.csv', (err) => {
            if (err) {
                res.status(500).send('Error while downloading the file.');
            }
        });
    });
}
function PrepareTXT(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = yield Movie.findAll();
        //Update Movie to Get the Latest Movie First
        movies.reverse();
        // Convert data to CSV format
        let csvContent = 'ID, Name, Duration, Rating\n';
        movies.forEach((row) => {
            csvContent += `${row.id}, ${row.name}, ${row.duration}, ${row.rating}\n`;
        });
        // Create a CSV file
        fs.writeFileSync('data.txt', csvContent);
        // Serve the file for download
        return res.download('data.txt', 'data.txt', (err) => {
            if (err) {
                return res.status(500).send('Error while downloading the file.');
            }
        });
    });
}
function EditMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, movie } = req.body;
        try {
            const result = Movie.update({ name: movie.name, duration: movie.duration, rating: movie.rating }, { where: { id } });
            return res.json({ status: "success", message: 'Movie updated successfully', result });
        }
        catch (e) {
            return res.status(500).json({ error: 'An error occurred while updating the movie' });
        }
    });
}
function DeleteMovie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            yield Movie.destroy({ where: { id } });
            return res.status(200).json({ status: "success", message: 'Movie deleted successfully' });
        }
        catch (e) {
            return res.status(500).json({ error: 'An error occurred while retrieving movie' });
        }
    });
}
module.exports = { GetMovies, AddMovie, EditMovie, DeleteMovie, PrepareCSV, PrepareTXT, GetMovieByID };
