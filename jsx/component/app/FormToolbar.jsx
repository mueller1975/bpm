import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { lazyWithRefForwarding, Loading } from 'Components';
import { useNotification } from 'Hook/useTools.jsx';
import { merge } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { expandedFormsState, targetFormUUIDState } from './context/BuilderStates';
import { globalFormContextState } from './context/FormContextStates';
import { allFormIdsState, allFormsState, allFormUUIDsState, formDataState } from './context/FormStates';
import { flowUserTaskState, userState } from './context/UserStates';
import FormActions from './FormActions.jsx';
import FormContent from './FormContent.jsx';
import { getFormFieldValues, createFormMetaData, jsonToObject } from './lib/form';
import testFormData from './lib/testFormData.json';

export default React.memo(styled(props => {

    
})`

`);