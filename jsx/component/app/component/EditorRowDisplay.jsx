import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ServiceContext } from 'Context/ServiceContext.jsx';
import React, { useContext } from 'react';
import * as U from '../lib/formJsonUtils.js';
import moment from 'moment';

export default React.memo(styled(props => {
    const { columns, value } = props;
    const serviceCtx = useContext(ServiceContext);

    return (
        !columns ? null :
            columns.map(({ name, label, type, configCode, displayRealDate = false, availableWhen }) => {

                const availableWhenFunc = availableWhen && new Function(['row', 'U'], `return ${availableWhen}`);
                const available = !availableWhenFunc || availableWhenFunc(value, U);

                // not availabe 則不顯示
                if (!available) {
                    return null;
                }

                const fieldValue = value[name];
                let display = <Typography>{fieldValue}</Typography>;

                switch (type) {
                    case 'autocomplete':
                    case 'dropdown':
                        let options = serviceCtx.dropdowns.value.find(({ code }) => code === configCode);
                        let optionName = options?.value.find(({ code, name }) => (code ?? name) === fieldValue)?.name;

                        if (optionName?.indexOf('data:image') == 0) { // 圖示下拉選項
                            display = <img src={optionName} />;
                        } else if (optionName && configCode == 'DATE_FORMAT' && displayRealDate) { // 日期格式下拉選項
                            let dateString = moment().format(optionName);
                            display = <Typography>{dateString}</Typography>;
                        }

                        break;
                    default:
                }

                return (
                    <div key={name} className="MT-EditorRowDisplayColumn">
                        {display}
                    </div>
                );
            })
    );
})`
   
`);
