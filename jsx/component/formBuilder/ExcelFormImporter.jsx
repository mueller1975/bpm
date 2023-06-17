import React, { useEffect, useRef, useState, useCallback } from 'react';
import { IconButton, Typography, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import readXlsxFile from 'read-excel-file';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { styled } from '@mui/material/styles';
import { readSpecLines, organizeSpecForms } from './lib/excelForm';
import { useResponseVO } from 'Hook/useTools.jsx';

// 資料儲存 fetch api 建構者
const saveForms = forms => fetch('service/config/saveForms', {
    method: 'POST', redirect: 'manual', body: JSON.stringify(forms),
    headers: {
        'Content-Type': 'application/json',
    }
});

export default styled(({ className }) => {
    const [excelFileInfo, setExcelFileInfo] = useState();
    const fileInputRef = useRef();
    const { execute: saveFormConfigs, pending: saving, value, error } = useResponseVO(saveForms);

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    const importFile = useCallback(e => {
        const files = e.target.files;
        let file = files[0];

        // 讀取 excel 並儲存相關資訊
        readXlsxFile(files[0], { getSheets: true }).then((sheetNames) => {
            let info = {
                file,
                allSheets: sheetNames.map(({ name }) => name),
                formSpecSheets: sheetNames.filter(({ name }) => name.indexOf('欄位規格') > -1).map(({ name }) => name),
                menuSheets: sheetNames.filter(({ name }) => name.indexOf('下拉清單') > -1).map(({ name }) => name)
            }

            setExcelFileInfo(info);
        });
    }, []);

    // 讀取 "欄位規格" 工作表
    const readFormSpec = useCallback(async () => {
        const { file, formSpecSheets } = excelFileInfo;

        const formRows = await readSpecLines(file, formSpecSheets);
        const forms = organizeSpecForms(formRows);

        const formConfigs = forms.map(form => ({
            category: "MPB_FORM_LAB",
            code: `MPB_FORM_LAB_${form.id}`,
            description: `MPB FORM (LAB) - ${form.title}`,
            value: JSON.stringify(form)
        }));

        saveFormConfigs({ params: formConfigs })

        console.log(formConfigs)
    }, [excelFileInfo]);

    return (
        <Paper className={className}>
            <input type="file" accept="" hidden ref={fileInputRef} onChange={importFile}></input>
            <IconButton color="warning" onClick={openFileDialog}><UploadFileIcon /></IconButton>

            <div className="excelInfo">
                <Typography color="textSecondary" noWrap>表單欄位規格工作表：</Typography>
                <Typography color="secondary">{excelFileInfo?.formSpecSheets.join(',')}</Typography>
            </div>

            <div className="excelInfo">
                <Typography color="textSecondary" noWrap>下拉清單工作表：</Typography>
                <Typography color="primary">{excelFileInfo?.menuSheets.join(',')}</Typography>
            </div>

            <div className="excelInfo">
                <Typography color="textSecondary" noWrap>所有工作表：</Typography>
                <Typography>{excelFileInfo?.allSheets.join('、')}</Typography>
            </div>

            {
                excelFileInfo?.formSpecSheets.length > 0 && <IconButton color="success" onClick={readFormSpec}><NoteAddIcon /></IconButton>
            }

        </Paper>
    );
})`

    width: 100%;
    height: 100%;

    .excelInfo {
        display: flex;
    }

`;