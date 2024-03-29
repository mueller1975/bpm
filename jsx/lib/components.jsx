import ErrorBoundary from 'Component/ErrorBoundary.jsx'
import Fieldset from 'Component/Fieldset.jsx'
import HideOnScroll from 'Component/HideOnScroll.jsx'
import IconnedDialogTitle from 'Component/IconnedDialogTitle.jsx'
import LoadableTable from 'Component/LoadableTable.jsx'
import LoadableView from 'Component/LoadableView.jsx'
import Loading from 'Component/Loading.jsx'
import MaskModal from 'Component/MaskModal.jsx'
import ProgressButton from 'Component/ProgressButton.jsx'
import Scrollable from 'Component/Scrollable.jsx'
import StyledSnackbarProvider from 'Component/StyledSnackbarProvider.jsx'
import React, { Suspense } from 'react';
import ProgressMask from 'Component/ProgressMask.jsx';

export const lazyWithRefForwarding = V => {
    // const V = React.lazy(() => import(path)) // 在此 import, path 會抓不到

    return React.forwardRef((props, ref) => (
        <Suspense fallback={<Loading />}>
            <V ref={ref} {...props} />
        </Suspense>
    ))
}

export {
    ErrorBoundary, Fieldset, HideOnScroll, IconnedDialogTitle, LoadableTable, LoadableView,
    Loading, MaskModal, ProgressButton, Scrollable, StyledSnackbarProvider, ProgressMask
};

export const FileSelector = props => <ErrorBoundary><_FileSelector {...props} /></ErrorBoundary>

export const InputDialog = lazyWithRefForwarding(React.lazy(() => import("Component/InputDialog.jsx")))
export const DraggableDialog = lazyWithRefForwarding(React.lazy(() => import("Component/DraggableDialog.jsx")))
export const SideMenu = lazyWithRefForwarding(React.lazy(() => import("Component/SideMenu.jsx")))
export const Preferences = lazyWithRefForwarding(React.lazy(() => import("Component/Preferences.jsx")))
export const ConfirmDialog = lazyWithRefForwarding(React.lazy(() => import("Component/ConfirmDialog.jsx")))

// DataTable 已被 RemoteDataTable/LocalDataTable 取代
// export const DataTable = lazyWithRefForwarding(React.lazy(() => import("Component/DataTable/DataTable.jsx")))

export const RemoteDataTable = lazyWithRefForwarding(React.lazy(() => import("Component/DataTable/RemoteDataTable.jsx")))
export const LocalDataTable = lazyWithRefForwarding(React.lazy(() => import("Component/DataTable/LocalDataTable.jsx")))
export const DataTableX = lazyWithRefForwarding(React.lazy(() => import("Component/DataTable/DataTableX.jsx")))

export const RoleDialog = lazyWithRefForwarding(React.lazy(() => import("Component/dialog/RoleDialog.jsx")))
export const EmployeeDialog = lazyWithRefForwarding(React.lazy(() => import("Component/dialog/EmployeeDialog.jsx")))
export const LocationDialog = lazyWithRefForwarding(React.lazy(() => import("Component/dialog/LocationDialog.jsx")))
export const DateRangeFilter = lazyWithRefForwarding(React.lazy(() => import("Component/filter/DateRangeFilter.jsx")))
export const UnitFilter = lazyWithRefForwarding(React.lazy(() => import("Component/filter/UnitFilter.jsx")))
export const StaffFilter = lazyWithRefForwarding(React.lazy(() => import("Component/filter/StaffFilter.jsx")))
export const DepartmentDialog = lazyWithRefForwarding(React.lazy(() => import("Component/dialog/DepartmentDialog.jsx")))
export const DeptEmployeeDialog = lazyWithRefForwarding(React.lazy(() => import("Component/dialog/DeptEmployeeDialog.jsx")))
