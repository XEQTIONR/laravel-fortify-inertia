export default function flatten(categories) {
    if (categories.length === 0) {
        return categories;
    }
    if (categories[0].children === null) {
        return [categories[0], ...flatten(categories.slice(1))]
    }
    return [categories[0], ...flatten(categories[0].children), ...flatten(categories.slice(1))];
}
