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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMovie = exports.EditMovie = exports.PrepareTXT = exports.PrepareCSV = exports.AddMovie = exports.GetMovies = exports.GetMovieByID = void 0;
const sequelize_1 = require("sequelize");
const getConn_1 = require("../database/getConn");
const sequelize_2 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const Movie = getConn_1.sequelize.define('Movie', {
    name: sequelize_1.DataTypes.STRING,
    duration: sequelize_1.DataTypes.STRING,
    rating: sequelize_1.DataTypes.STRING,
});
getConn_1.sequelize.sync();
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
exports.GetMovieByID = GetMovieByID;
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
                            [sequelize_2.Op.like]: `%${q}%`
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
exports.GetMovies = GetMovies;
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
exports.AddMovie = AddMovie;
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
        fs_1.default.writeFileSync('data.csv', csvContent);
        // Serve the file for download
        return res.download('data.csv', 'data.csv', (err) => {
            if (err) {
                res.status(500).send('Error while downloading the file.');
            }
        });
    });
}
exports.PrepareCSV = PrepareCSV;
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
        fs_1.default.writeFileSync('data.txt', csvContent);
        // Serve the file for download
        return res.download('data.txt', 'data.txt', (err) => {
            if (err) {
                return res.status(500).send('Error while downloading the file.');
            }
        });
    });
}
exports.PrepareTXT = PrepareTXT;
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
exports.EditMovie = EditMovie;
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
exports.DeleteMovie = DeleteMovie;
