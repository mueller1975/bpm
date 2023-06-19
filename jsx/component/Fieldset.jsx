import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export default styled(props => {
    const { title, icon, children, className, classes = {}, ...otherProps } = props

    return (
        <fieldset {...otherProps} className="className">
            <legend className={`legend ${classes.legend}`}>
                {icon && <props.icon fontSize="small" style={{ marginRight: 4 }} />}
                {title && typeof title === 'string' ? <Typography variant="subtitle2">{title}</Typography> : title}
            </legend>

            {children}
        </fieldset>
    )
})`
    border: 0;
    border-radius: 4px;
    background: rgb(68 132 187 / 15%);

    .legend {
        display: flex;
        align-items: center;
        padding: 2px 8px;
        background: linear-gradient(135deg,rgb(11 83 103 / 50%),rgb(31 109 138 / 80%),rgb(11 83 103 / 50%));
        border-radius: 4px
        box-shadow: 2px 4px 4px 3px rgb(6 32 64 / 68%);
        color: #b7c9ce;
    }
`;