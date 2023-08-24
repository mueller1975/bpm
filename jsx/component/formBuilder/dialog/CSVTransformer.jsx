import { TextField, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDebounce } from 'Hook/useTools.jsx';
import React, { useEffect, useState } from 'react';
import { rawDataToJson } from './lib/jsonConverter';
import ResizableBlocks from 'Component/ResizableBlocks.jsx';

export default styled(props => {
    const { onTransform, value, category, className } = props;

    const [rawData, setRawData] = useState('');
    const [jsonString, setJsonString] = useState('');
    const [javaCode, setJavaCode] = useState('');

    const [fieldCount, setFieldCount] = useState(0);
    const [error, setError] = useState();

    const debouncedRawData = useDebounce(rawData, 500);

    useEffect(() => {
        try {
            const [jsonObject, javaVars, count] = rawDataToJson(rawData, category);

            setFieldCount(count);
            setJsonString(JSON.stringify(jsonObject, null, 2));
            setJavaCode(javaVars.join(''));
            onTransform(jsonObject);

            setError();
        } catch (e) {
            console.error(e);
            setError(e.message ?? e);
        }
    }, [debouncedRawData]);

    // 原始資料欄位按 Tab 鍵時, 自動加上 \t, 且不跳到下一個 tabIndex 元件
    const keyDownHandler = e => {
        if (e.key == 'Tab') {
            e.preventDefault();

            let elm = e.target;
            elm.setRangeText('\t', elm.selectionStart, elm.selectionStart, 'end');
        }
    };

    const rawDataChangeHandler = e => {
        setRawData(e.target.value);
    };

    return (
        <ResizableBlocks>
            <div className={`${className} block`}>
                <TextField label="CSV 資料" autoFocus multiline rows={15} fullWidth value={rawData}
                    error={Boolean(error)} onChange={rawDataChangeHandler} onKeyDown={keyDownHandler}
                    helperText={error} />
            </div>

            <div className={`${className} block`}>
                <TextField label={`JSON 格式（${fieldCount} 筆）`} multiline rows={15} fullWidth value={jsonString} />
            </div>

            <div className={`${className} block`}>
                <TextField label={`JAVA Code（${fieldCount} 筆）`} multiline rows={15} fullWidth value={javaCode} />
            </div>
        </ResizableBlocks>

        // <Grid container spacing={2} className={className}>
        //     {/* CSV 資料 */}
        //     <Grid item xs={5}>
        //         <TextField label="CSV 資料" autoFocus multiline rows={15} fullWidth value={rawData}
        //             error={Boolean(error)} onChange={rawDataChangeHandler} onKeyDown={keyDownHandler}
        //             helperText={error}
        //         />
        //     </Grid>

        //     {/* JSON 格式 */}
        //     <Grid item xs={3}>
        //         <TextField label={`JSON 格式（${fieldCount} 筆）`} multiline rows={15} fullWidth value={jsonString} />
        //     </Grid>

        //     {/* JAVA Code */}
        //     <Grid item xs={4}>
        //         <TextField label={`JAVA Code（${fieldCount} 筆）`} multiline rows={15} fullWidth value={javaCode} />
        //     </Grid>
        // </Grid>
    );
})`
    &.block {
        padding: 8px;
    }
`;