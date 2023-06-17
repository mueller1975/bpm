import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, IconButton, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMessages } from 'Hook/contextHooks.jsx';
import React, { useEffect } from 'react';

export default React.memo(styled(props => {
    const { keyword, keywordOptions, onKeywordChange, onRemoveKeyword, onExit, className, disabled = false } = props;

    const getMessage = useMessages();

    useEffect(() => {
        return () => {
            // 關閉 search bar 時, 儲存 keyword 歷程
            onExit(keywordOptions); // 儲存 keyword 歷程
        };
    }, [keywordOptions]);

    // 選取下拉歷史關鍵字或手動輸入關鍵字
    const onChangeKeyword = (e, value, reason) => {
        onKeywordChange(value ?? '');
    };

    // 刪除查詢關鍵字
    const deleteOption = (e, option) => {
        onRemoveKeyword(option);
        e.stopPropagation();
    };

    return (
        <Autocomplete
            className={className}
            fullWidth size="small" margin="none"
            value={keyword} onChange={onChangeKeyword}
            options={keywordOptions}
            disabled={disabled}
            freeSolo
            slotProps={{
                paper: { className: `${className} bk-paper` },
            }}

            renderInput={params => <TextField {...params}
                inputRef={props.inputRef}
                onChange={e => onKeywordChange(e.target.value)}
                // autoFocus
                variant="standard"
                placeholder={getMessage('dataTable.keyword.hint')}
            />}

            openOnFocus

            renderOption={(renderOptions, option) => (
                <li {...renderOptions} className={`${renderOptions.className} ${className} option`}>
                    <Typography component="span" color="textSecondary">{option}</Typography>
                    <IconButton size='small' onClick={e => deleteOption(e, option)}>
                        <DeleteIcon />
                    </IconButton>
                </li>
            )}
        />
    )
})`
    &.option {
        >span:first-of-type {
            flex-grow: 1;
        }
    }

    &.bk-paper {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(255 255 255 / 85%)' : 'rgb(0 0 0 / 80%)'};
    }
`);