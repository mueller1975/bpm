import { Fab } from '@mui/material';
import { styled } from '@mui/material/styles';

export default styled(Fab)`
    opacity: .8;
    transition: all .5s;

    :not([Mui-disabled]):hover {
        opacity: 1;
        transform: scale(1.1);
    }
`;