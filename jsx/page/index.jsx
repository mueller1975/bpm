import React, { useEffect, useCallback } from 'react';
import { Typography } from '@mui/material';
import { createRoot } from 'react-dom/client';
import FormBuilder from '../component/FormBuilder.jsx';

const Index = props => {

    return (
        <div>
            <Typography color="secondary">Congratulations!</Typography>

            <FormBuilder />
        </div>
    );
};

const root = createRoot(document.querySelector('#root'));
root.render(<Index />);