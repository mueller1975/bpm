import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ComponentGrid from './ComponentGrid.jsx';
import { TextField } from '@mui/material';

export default React.memo(props => {
    const { name, label, helper, type, hidden = false, readOnly = false,
        multiline = false, minRows = 3, maxRows = 5, className } = props;

    return (
        <ComponentGrid {...props}>
            {
                ({ required, available, disabled, valueChangedHandler,
                    defaultValue, value, error, dbTableColumn }) => {


                    return (
                        <>
                            {/* uncontrolled component 一定要有 defaultValue 屬性 */}
                            <TextField
                                fullWidth
                                size="small"
                                // size={disabled ? 'medium' : 'small'}
                                variant={disabled ? 'outlined' : 'filled'}
                                multiline={multiline}
                                minRows={minRows}
                                maxRows={maxRows}
                                label={label}
                                hidden={hidden}
                                disabled={disabled}
                                required={required}

                                className={className}
                            />
                        </>
                    );
                }
            }
        </ComponentGrid>
    );
});