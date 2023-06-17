import React, { useEffect, useCallback } from 'react';
import { Typography } from '@mui/material';
import { createRoot } from 'react-dom/client';
import ExcelFormImporter from '../component/ExcelFormImporter.jsx';

const Index = props => {

    return (
        <div>
            <Typography color="secondary">Congratulations!</Typography>

            <ExcelFormImporter />
        </div>
    );
};

const root = createRoot(document.querySelector('#root'));
root.render(<Index />);