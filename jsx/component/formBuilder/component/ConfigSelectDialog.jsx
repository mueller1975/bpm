import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SelectDialog from 'Component/SelectDialog.jsx';
import { useResponseVO } from 'Hook/useTools.jsx';
import React, { useCallback, useEffect, useState } from 'react';
import LoadableTable from '../../component/LoadableTable.jsx';
import { styled } from '@mui/material/styles';

export default React.memo(styled(props => {
    const { title, open, onConfirm, onClose, configCode, filterBy, row } = props;
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [error, setError] = useState();

    const fetchValueFunc = useCallback(() => fetch(`service/config?code=${configCode}`, { method: 'GET', redirect: 'manual' }),
        [configCode]);
    const { execute: fetchValue, pending: fetching, value: configValue, error: fetchError } = useResponseVO(fetchValueFunc);

    useEffect(() => {
        fetchValue && fetchValue();
    }, [fetchValue]);

    useEffect(() => {
        fetchError && setError(fetchError.message);

        if (configValue) {
            try {
                const { columns, data } = JSON.parse(configValue);
                setColumns(columns);

                if (filterBy) {
                    if (typeof filterBy != 'object') {
                        throw Error('filterBy 必須是物件型態');
                    }

                    let filteredData = data.filter(obj => {
                        return !Object.entries(filterBy).some(([colProp, rowProp]) => obj[colProp] !== row[rowProp]);
                    });

                    console.log({ filteredData })
                    setData(filteredData);
                } else {
                    setData(data);
                }
            } catch (err) {
                console.error(`JSON 解析失敗:\n${err.message}\nJSON:\n${configValue}`);
                setError(`JSON 解析失敗:\n${err.message}`);
            }
        }
    }, [configValue, fetchError, filterBy, row]);

    return (
        <SelectDialog
            maxWidth="md"
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            icon={PlaylistAddCheckIcon}
            title={title}
        >
            {
                (rowClickHandler, rowDblClickHandler) =>
                    <div className={props.className}>
                        <LoadableTable
                            loading={fetching}
                            loadError={error}
                            data={data}
                            columns={columns}
                            onClickRow={rowClickHandler}
                            onDoubleClickRow={rowDblClickHandler} />
                    </div>
            }
        </SelectDialog>
    );
})`
    padding: 10px 16px 20px 12px;
`);