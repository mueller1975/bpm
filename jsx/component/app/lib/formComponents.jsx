import React from 'react';
import { lazyWithRefForwarding } from 'Components';

import GridAutocomplete from '../component/GridAutocomplete.jsx';
import GridRemoteAutocomplete from '../component/GridRemoteAutocomplete.jsx';
import GridCheckbox from '../component/GridCheckbox.jsx';
import GridDropdown from '../component/GridDropdown.jsx';
import GridFileUploader from '../component/GridFileUploader.jsx';
import GridInlineEditor from '../component/GridInlineEditor.jsx';
import GridNumberRange from '../component/GridNumberRange.jsx';
import GridTableSelect from '../component/GridTableSelect.jsx';
import GridTextField from '../component/GridTextField.jsx';
import ComponentGroup from '../component/ComponentGroup.jsx';
import Conditional from '../component/Conditional.jsx';
import ConditionalGrid from '../component/ConditionalGrid.jsx';
import GridFieldsetContainer from '../component/GridFieldsetContainer.jsx';

export const MPBApprovalDialog = lazyWithRefForwarding(React.lazy(() => import("../component/MPBApprovalDialog.jsx")));
export const MPBLogDialog = lazyWithRefForwarding(React.lazy(() => import("../component/MPBLogDialog.jsx")));
export const MPBAddReviewersDialog = lazyWithRefForwarding(React.lazy(() => import("../component/MPBAddReviewersDialog.jsx")));

// export const GridAutocomplete = lazyWithRefForwarding(React.lazy(() => import("./GridAutocomplete.jsx")));
// export const GridCheckbox = lazyWithRefForwarding(React.lazy(() => import("./GridCheckbox.jsx")));
// export const GridDropdown = lazyWithRefForwarding(React.lazy(() => import("./GridDropdown.jsx")));
// export const GridFileUploader = lazyWithRefForwarding(React.lazy(() => import("./GridFileUploader.jsx")));
// export const GridInlineEditor = lazyWithRefForwarding(React.lazy(() => import("./GridInlineEditor.jsx")));
// export const GridNumberRange = lazyWithRefForwarding(React.lazy(() => import("./GridNumberRange.jsx")));
// export const GridTableSelect = lazyWithRefForwarding(React.lazy(() => import("./GridTableSelect.jsx")));
// export const GridTextField = lazyWithRefForwarding(React.lazy(() => import("./GridTextField.jsx")));
// export const ComponentGroup = lazyWithRefForwarding(React.lazy(() => import("./ComponentGroup.jsx")));
// export const Conditional = lazyWithRefForwarding(React.lazy(() => import("./Conditional.jsx")));
// export const ConditionalGrid = lazyWithRefForwarding(React.lazy(() => import("./ConditionalGrid.jsx")));
// export const FieldsetContainer = lazyWithRefForwarding(React.lazy(() => import("./FieldsetContainer.jsx")));

export {
    GridAutocomplete, GridRemoteAutocomplete, GridCheckbox, GridDropdown, GridFileUploader, GridInlineEditor,
    GridNumberRange, GridTableSelect, GridTextField, ComponentGroup, Conditional, ConditionalGrid, GridFieldsetContainer
};