const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT
const RedisClient = redis.createClient(REDIS_PORT);

// Category Cache

class CacheController {
    async Category(req, res, next) {
        try {
            const key = 'categories'
            RedisClient.get(key, (error, results) => {
                if (results) {
                    return res.status(200).json({
                        status: true,
                        data: JSON.parse(results)
                    })
                } else {
                    next()
                }
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Category Cache
    async CategoryType(req, res, next) {
        try {
            const key = 'category'
            RedisClient.get(key, (error, results) => {
                if (results) {
                    return res.status(200).json({
                        status: true,
                        data: JSON.parse(results)
                    })
                } else {
                    next()
                }
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    //Sub Category Cache
    async SubCategory(req, res, next) {
        try {
            const { category } = req.params
            const key = "category-" + category

            RedisClient.get(key, (error, result) => {
                if (result) {
                    return res.status(200).json({
                        status: true,
                        data: JSON.parse(result)
                    })
                } else {
                    next()
                }
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Elements by main category
    async ElementByMainCategory(req, res, next) {
        try {
            const { mainCategory } = req.params
            const key = "elements-" + mainCategory

            RedisClient.get(key, (error, result) => {
                if (result) {
                    return res.status(200).json({
                        status: true,
                        data: JSON.parse(result)
                    })
                } else {
                    next()
                }
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Default Element
    async DefaultElement(req, res, next) {
        try {
            const { category_id } = req.params
            const key = "default-element-" + category_id

            RedisClient.get(key, (error, result) => {
                if (result) {
                    return res.status(200).json({
                        status: true,
                        data: JSON.parse(result)
                    })
                } else {
                    next()
                }
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Size
    async Sizes(req, res, next) {
        try {
            const key = 'sizes'
            RedisClient.get(key, (error, results) => {
                if (results) {
                    return res.status(200).json({
                        status: true,
                        data: JSON.parse(results)
                    })
                } else {
                    next()
                }
            })
        } catch (error) {
            if (error) next(error)
        }
    }

    // Backsides elements
    async BacksideElements(req, res, next) {
        try {
            const { category } = req.params
            const key = "backside-elements-" + category

            RedisClient.get(key, (error, results) => {
                if (results) {
                    return res.status(200).json({
                        status: true,
                        data: JSON.parse(results)
                    })
                } else {
                    next()
                }
            })
        } catch (error) {
            if (error) next(error)
        }
    }
}

module.exports = new CacheController();