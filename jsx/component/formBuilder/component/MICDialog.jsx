import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SelectDialog from 'Component/SelectDialog.jsx';
import { RemoteDataTable } from 'Components';
import { merge } from 'lodash';
import React, { useState } from 'react';
import { cloneDeep } from 'lodash';

/**
 * MIC 選取 Dialog
 */
export default React.memo(props => {
    const { name, config, urlParams, params, title, open, onConfirm, onClose } = props;
    const [tableConfig] = useState(cloneDeep(config));
    const { dialogWidth = "md", tableKey, enableKeywordSearch = false } = tableConfig;
    let tableOptions = tableConfig.tableOptions;

    if (urlParams) {
        tableOptions = { ...tableOptions, urlParams: merge({}, tableOptions.urlParams, urlParams) };
    }

    if (params) {
        tableOptions = { ...tableOptions, params: merge({}, tableOptions.params, params) };
    }

    return (
        <SelectDialog
            maxWidth={dialogWidth}
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            icon={PlaylistAddCheckIcon}
            title={title}
            disableTitle={false}
        >
            {
                (rowClickHandler, rowDblClickHandler) =>
                    <RemoteDataTable
                        showCheckbox={false}
                        enableKeywordSearch={enableKeywordSearch}
                        resizable
                        storageKey={tableKey}
                        options={tableOptions}
                        // onSelectRow={rowClickHandler} 
                        onClickRow={rowClickHandler}
                        onDoubleClickRow={rowDblClickHandler}
                    />
            }
        </SelectDialog>
    );
});