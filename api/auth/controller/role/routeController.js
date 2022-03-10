const lodash = require('lodash');
const { RouteGroupName } = require('../../../helpers/index');
const { router } = require('../../routes/adminRoute');

class RoleRouteController {
    async Index(req, res, next) {
        try {
            let items = []

            const stacks = await router.stack
            items.push({ group: "all", paths: null }, { group: "role", paths: null })

            if (stacks && stacks.length) {
                for (let i = 0; i < stacks.length; i++) {
                    const element = stacks[i]

                    const pathName = element.route.path
                    const pathGroupName = RouteGroupName(pathName)

                    let existItem = lodash.find(items, item => item.group === pathGroupName)
                    if (existItem) {
                        existItem.paths.push({
                            name: pathGroupName,
                            path: pathName,
                            method: element.route.stack[0].method.toUpperCase()
                        })
                    } else {
                        items.push({
                            group: pathGroupName,
                            paths: [{
                                name: pathGroupName,
                                path: pathName,
                                method: element.route.stack[0].method.toUpperCase()
                            }]
                        })
                    }
                }
            }

            res.status(200).json({ data: items })
        } catch (error) {
            if (error) next(error)
        }
    }

}

module.exports = new RoleRouteController();