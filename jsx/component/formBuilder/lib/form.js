export const flattenFormComponents = allForms => {
    let flatComponents = {};

    allForms.forEach(({ id, components }) => {
        components && components.forEach(({ uuid, type, fields, components: groupComponents }) => {
            if (type == 'fieldset') {
                flatComponents[uuid] = fields;
            } else if (type == 'componentGroup') {
                flatComponents[uuid] = groupComponents;

                groupComponents && groupComponents.forEach(({ uuid, type, fields }) => {
                    if (type == 'fieldset') {
                        flatComponents[uuid] = groupComponents;
                    } else if (type == 'divider') {
                        // 不處理
                    } else {
                        throw `[${type}] in wrong place!!!`;
                    }
                });
            } else if (type == 'divider') {
                // 不處理
            } else {
                throw `[${type}] in wrong place!!!`;
            }
        });
    });

    return flatComponents;
};