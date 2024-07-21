const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

router.get('/search', async (req, res) => {
    const { query, filter } = req.query;
    let listings;

    if (filter === 'trending') {
        listings = await Listing.find({}).sort({ viewCount: -1 }).limit(10); // Get top 10 most viewed listings
    } else {
        const regex = new RegExp(query, 'i'); // Case-insensitive regex for search

        listings = await Listing.find({
            $or: [
                { location: regex },
                { country: regex }
            ]
        }).populate('owner').populate('reviews.author');
    }

    res.render('listings/searchResults', { listings, query });
});

module.exports = router;
