/**
 * 檔案選取 component
 */
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useRef } from 'react';
import DownloadButton from './DownloadButton.jsx';
import { useNotification } from 'Hook/useTools.jsx';
import { MAX_FILE_MB } from '../lib/formConsts';

export default styled(props => {
    // const { onSelect, onDelete, attachments } = props
    const { date, id, name, uploaded, error, onSelect, variant, ...others } = props;

    const attachInputRef = useRef();
    const { showError } = useNotification();

    const clickHandler = e => {
        attachInputRef.current.click();
    };

    const inputChanged = e => {
        const files = attachInputRef.current.files;

        // 檔名寫入 row 欄位中
        if (files.length > 0) {
            console.log(files[0])
            const { name: fileName, size: fileSize } = files[0];

            if (fileSize > MAX_FILE_MB * 1024 * 1024) {
                attachInputRef.current.value = ''; // 清除 input 選取的檔案
                onSelect([]); // 清空欄位值

                showError(`單一檔案大小不可超出 ${MAX_FILE_MB} MB（實際為 ${(fileSize / 1024 / 1024).toFixed(2)} MB）！`);
            } else {
                onSelect(files);
            }
        } else { // *** 使用者按了取消, 必須清除 input 原先已選取的檔案
            attachInputRef.current.value = ''; // 清除 input 選取的檔案
            onSelect([]); // 清空欄位值
        }
    };

    return (
        <>
            <TextField
                {...others}

                required
                variant={uploaded ? 'outlined' : variant}
                inputProps={{ readOnly: true }}
                error={Boolean(error)}
                helperText={error}

                InputProps={{
                    endAdornment: props.disabled && !uploaded ? undefined :
                        <InputAdornment position="end">
                            {
                                uploaded ?
                                    <Tooltip title={<Typography variant="subtitle2" align="center">{`下載檔案「${props.value}」`}</Typography>} arrow>
                                        <div>
                                            <DownloadButton date={date} id={id} filename={props.value} />
                                        </div>
                                    </Tooltip> :
                                    <IconButton color="primary" onClick={clickHandler} disabled={props.disabled}>
                                        <TouchAppIcon />
                                    </IconButton>
                            }
                        </InputAdornment>
                }}
            />

            {/* file upload 欄位 */}
            <input id={id} type="file" ref={attachInputRef} hidden onChange={inputChanged} />
        </>
    )
})`

`;