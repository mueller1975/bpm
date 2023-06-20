import React, { useCallback, useEffect } from 'react';
import {
    AppBar, Toolbar, IconButton, Grid, Box, Checkbox, Divider,
    Accordion, AccordionDetails, AccordionSummary, Drawer, List, ListItem, ListItemIcon, ListItemSecondaryAction,
    ListItemText, ListSubheader, MenuItem, Popover, Slider, Switch, TextField, Typography, SwipeableDrawer
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixed';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

// Popover 位置
const anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    transformOrigin = { vertical: 'top', horizontal: 'right' };

const FIELD_TYPES = [
    { code: "text", name: "文字" },
    { code: "number", name: "數字" },
    { code: "numberRange", name: "數字範圍" },
    { code: "yesOrNo", name: "Y/N" },
    { code: "dropdown", name: "下拉選單" },
    { code: "autocomplete", name: "下拉選單（可輸入）" },
    { code: "tableSelect", name: "表格選取" },
    { code: "inlineEditor", name: "子表多筆" },
    { code: "fileUploader", name: "附件" },
];

const FIELD_TYPE_MENUS = FIELD_TYPES.map(({ code, name }) => <MenuItem key={code}>{name}</MenuItem>);

export default React.memo(styled(props => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField name="name" label="欄位名稱" size="small" fullWidth autoComplete="off" />
            </Grid>

            <Grid item xs={12}>
                <TextField name="label" label="欄位標籤" size="small" fullWidth />
            </Grid>

            <Grid item xs={12}>
                <TextField name="type" label="欄位屬性" size="small" fullWidth select>
                    {FIELD_TYPE_MENUS}
                </TextField>
            </Grid>

            <Grid item xs={12}>
                <Divider light>
                    <div className="divider-title">
                        <FormatListNumberedIcon fontSize="small" />
                        <Typography color="textSecondary">子表多筆屬性</Typography>
                    </div>
                </Divider>
            </Grid>

            <Grid item xs={12}>
                <TextField name="name" label="欄位名稱" size="small" fullWidth />
            </Grid>
        </Grid>

    );
})`

`);